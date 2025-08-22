"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import { Header } from "@/components/ui/header";
import {
    MemberList,
    type PlayerStat,
} from "@/components/features/room/MemberList";
import { TableList, type Table } from "@/components/features/room/TableList";

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

    const [room, setRoom] = useState<Room | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const [latestGames, setLatestGames] = useState<LatestGame[]>([]);
    const [loading, setLoading] = useState(true);

    // stats は成績表用の配列
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
                const { data: roomData, error: roomError } = await supabase
                    .from("rooms")
                    .select("*")
                    .eq("id", roomId)
                    .single();
                if (roomError) throw roomError;
                setRoom(JSON.parse(JSON.stringify(roomData)));

                // メンバー情報
                const { data: membersData, error: membersError } =
                    await supabase
                        .from("room_members")
                        .select("id, users(name)")
                        .eq("room_id", roomId);
                if (membersError) throw membersError;

                const membersWithNames: Member[] = (membersData as any[]).map(
                    (m) => ({
                        id: m.id,
                        name: m.users?.name || "名無し",
                    })
                );
                setMembers(JSON.parse(JSON.stringify(membersWithNames)));

                // 卓一覧
                const { data: tablesData, error: tablesError } = await supabase
                    .from("tables")
                    .select("*")
                    .eq("room_id", roomId);
                if (tablesError) throw tablesError;
                setTables(JSON.parse(JSON.stringify(tablesData)));

                // 最新対局
                const latestGamesData: LatestGame[] = [];
                for (const t of tablesData || []) {
                    const { data: gameData, error: gameError } = await supabase
                        .from("games")
                        .select("*")
                        .eq("table_id", t.id)
                        .order("created_at", { ascending: false })
                        .limit(1)
                        .single();
                    if (!gameError && gameData) {
                        latestGamesData.push(
                            JSON.parse(JSON.stringify(gameData))
                        );
                    }
                }
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
            {/* ヘッダー */}
            <Header backHref="/room-list" title={room?.name} />

            <main className="flex-1 max-w-3xl mx-auto p-4 space-y-6">
                {/* 卓一覧 */}
                <TableList
                    tables={tables}
                    onAddTable={() => console.log("卓を追加")}
                />
                {/* <div className="bg-white rounded-xl shadow p-4">
                    <h2 className="text-xl font-semibold mb-3">卓一覧</h2>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {tables.map((t) => (
                            <div
                                key={t.id}
                                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                            >
                                <span>{t.name}</span>
                                <span className="text-sm text-gray-500">
                                    {t.type}
                                </span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-3 p-3 border-2 border-dashed rounded-lg text-gray-500 hover:bg-gray-50">
                        ＋卓を追加
                    </button>
                </div> */}

                {/* メンバーリスト */}
                <MemberList stats={stats} />
            </main>
        </div>
    );
}
