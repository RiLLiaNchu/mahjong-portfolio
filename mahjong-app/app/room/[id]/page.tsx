// app/room/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import { Header } from "@/components/ui/header";
import {
    MemberList,
    type PlayerStat,
} from "@/components/features/room/MemberList";
import { TableList } from "@/components/features/room/TableList";
import { CreateTableDialog } from "@/components/features/room/CreateTableDialog";
import { useAuth } from "@/contexts/auth-context";
import { fetchTables, TableWithMembers } from "@/lib/api/tables";

type Member = { id: string; name: string };
type Room = { id: string; name: string; code: string };
type LatestGame = {
    id: string;
    table_id: string;
    scores: Record<string, number>;
    ranks: Record<string, number>;
};

export default function RoomPage() {
    const params = useParams();
    const roomId = params.id as string;
    const { profile } = useAuth();

    const [room, setRoom] = useState<Room | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const [tables, setTables] = useState<TableWithMembers[]>([]);
    const [latestGames, setLatestGames] = useState<LatestGame[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    // stats はメンバーリスト用の配列
    const stats: PlayerStat[] = members.map((m) => {
        const latest = latestGames.find((g) => g.scores[m.id] !== undefined);

        return {
            player_id: m.id,
            name: m.name,
            latest_score: latest ? latest.scores[m.id] : 0,
            latest_rank: latest ? latest.ranks[m.id] : 0,
            total_score: latestGames.reduce(
                (sum, g) => sum + (g.scores[m.id] || 0),
                0
            ),
        };
    });

    useEffect(() => {
        if (!roomId) return;

        const loadRoomData = async () => {
            try {
                // ルーム情報
                const { data: roomData } = await supabase
                    .from("rooms")
                    .select("*")
                    .eq("id", roomId)
                    .single();
                setRoom(roomData);

                // メンバー情報
                const { data: membersData, error: membersError } =
                    await supabase
                        .from("room_members")
                        .select(
                            `
                                id,
                                users!room_members_user_id_fkey (
                                id,
                                name
                                )
                            `
                        )
                        .eq("room_id", roomId);

                if (membersError) throw membersError;

                const membersWithNames: Member[] = (membersData || []).map(
                    (m: any) => ({
                        id: m.users?.id ?? m.id, // users.id があればそれを、なければ fallback で m.id
                        name: m.users?.name ?? "名無し",
                    })
                );

                setMembers(membersWithNames);

                // 卓一覧 + 卓メンバー
                const tableData = await fetchTables(roomId);
                setTables(tableData);

                // 最新対局
                const latestGamesData: LatestGame[] = await Promise.all(
                    (tableData || []).map(async (t) => {
                        const { data: gameData } = await supabase
                            .from("games")
                            .select("*")
                            .eq("table_id", t.id)
                            .order("created_at", { ascending: false })
                            .limit(1);

                        return gameData?.[0] ?? null;
                    })
                ).then((arr) => arr.filter((g): g is LatestGame => g !== null));

                setLatestGames(latestGamesData);
            } catch (err: any) {
                console.error("ルームデータ取得エラー:", err);
            } finally {
                setLoading(false);
            }
        };

        loadRoomData();
    }, [roomId]);

    if (loading) return <p className="text-center mt-10">読み込み中…</p>;
    if (!room)
        return (
            <p className="text-center mt-10">ルームが見つかりませんでした</p>
        );

    return (
        <div className="flex flex-col min-h-screen">
            <Header backHref="/room-list" title={room?.name} />

            {isCreateDialogOpen && (
                <CreateTableDialog
                    profile={profile}
                    roomId={roomId}
                    onClose={() => setIsCreateDialogOpen(false)}
                />
            )}

            <main className="flex-1 max-w-3xl mx-auto p-4 space-y-6">
                <TableList
                    profile={profile}
                    tables={tables}
                    roomId={roomId}
                    onAddTable={() => setIsCreateDialogOpen(true)}
                />

                <MemberList stats={stats} />
            </main>
        </div>
    );
}
