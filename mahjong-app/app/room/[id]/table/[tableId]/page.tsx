// table/[tableId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import { Header } from "@/components/ui/header";
import { GameWithStats, Member } from "@/types/game";
import { GameStatsModal } from "@/components/features/table-page/GameStatsModal";
import { ScoreSheet } from "@/components/features/table-page/ScoreSheet";
import { useAuth } from "@/contexts/auth-context";

type Table = {
    id: string;
    room_id: string;
    name: string;
    game_type: string;
    game_length: string;
    uma_top: number;
    uma_second: number;
    uma_third: number;
    uma_fourth: number;
    created_at: string;
    created_by: string;
};

export default function TablePage() {
    const params = useParams();
    const tableId = params.tableId as string;
    const { profile } = useAuth();

    const [table, setTable] = useState<Table | null>(null);
    const [gamesWithStats, setGamesWithStats] = useState<GameWithStats[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [bonuses, setBonuses] = useState<Record<string, number>>({});
    const [starting, setStarting] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentGameStatsId, setCurrentGameStatsId] = useState<string | null>(
        null
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!tableId || !profile?.id) return;

        const loadData = async () => {
            try {
                // 自分を table_members に追加（存在しなければ）
                const { data: existing } = await supabase
                    .from("table_members")
                    .select("*")
                    .eq("table_id", tableId)
                    .eq("user_id", profile.id)
                    .maybeSingle();

                if (!existing) {
                    await supabase.from("table_members").insert({
                        table_id: tableId,
                        user_id: profile.id,
                    });
                }

                // テーブル情報
                const { data: tableData } = await supabase
                    .from("tables")
                    .select("*")
                    .eq("id", tableId)
                    .single();
                setTable(tableData);

                // メンバー情報
                const { data: membersData } = await supabase
                    .from("table_members")
                    .select(
                        `
                    id,
                    users!table_members_user_id_fkey (
                        id,
                        name
                    )
                `
                    )
                    .eq("table_id", tableId);

                const membersWithNames: Member[] = (membersData || []).map(
                    (m: any) => ({
                        id: m.users?.id ?? m.id,
                        name: m.users?.name ?? "名無し",
                    })
                );
                setMembers(membersWithNames);

                // ゲームとstats
                const { data: gamesData } = await supabase
                    .from("games")
                    .select(`*, game_stats(*)`)
                    .eq("table_id", tableId)
                    .order("game_number", { ascending: true });

                const gamesWithStats: GameWithStats[] = (gamesData || []).map(
                    (g: any) => ({
                        ...g,
                        stats: g.game_stats || [],
                    })
                );
                setGamesWithStats(gamesWithStats);

                // ボーナス情報
                const { data: bonusesData } = await supabase
                    .from("bonuses")
                    .select("*");
                const initialBonuses: Record<string, number> = {};
                (bonusesData || []).forEach((b: any) => {
                    initialBonuses[b.user_id] = b.amount;
                });
                setBonuses(initialBonuses);
            } catch (err) {
                console.error("データ取得エラー:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [tableId, profile?.id]);

    if (loading) return <p className="text-center mt-10">読み込み中…</p>;
    if (!table)
        return <p className="text-center mt-10">卓が見つかりませんでした</p>;

    const handleStartGame = async () => {
        if (!table) return;
        if (members.length === 0) {
            alert("まだメンバーが揃っていません！");
            return;
        }

        setStarting(true);

        try {
            // 最終ゲーム番号取得
            const { data: lastGame, error: lastGameError } = await supabase
                .from("games")
                .select("game_number")
                .eq("table_id", table.id)
                .order("game_number", { ascending: false })
                .limit(1)
                .maybeSingle();

            if (lastGameError) throw lastGameError;

            const nextGameNumber = lastGame?.game_number
                ? lastGame.game_number + 1
                : 1;

            // 新しいゲーム作成
            const { data: newGame, error: newGameError } = await supabase
                .from("games")
                .insert([
                    {
                        table_id: table.id,
                        game_number: nextGameNumber, // ←ここ追加
                        created_at: new Date().toISOString(),
                    },
                ])
                .select("*")
                .single();

            if (newGameError || !newGame) {
                console.error("新しいゲーム作成失敗:", newGameError);
                alert("対局を開始できませんでした");
                setStarting(false);
                return;
            }

            // stats 作成
            const statsInserts = members.map((m) => ({
                game_id: newGame.id,
                user_id: m.id,
                rank: 0,
                point: 0,
                score: 0,
                chip: 0,
                agari_count: 0,
                agari_total: 0,
                deal_in_count: 0,
                deal_in_total: 0,
                riichi_count: 0,
                furo_count: 0,
                kyoku_count: 0,
                yakuman_count: 0,
                double_yakuman_count: 0,
            }));

            const { data: statsCreated, error: statsError } = await supabase
                .from("game_stats")
                .insert(statsInserts)
                .select("id, user_id");

            if (statsError) {
                console.error("game_stats 作成失敗:", statsError);
                alert("プレイヤーデータの初期化に失敗しました");
                return;
            }

            // 自分の game_stats.id を取得
            const myStatsId = statsCreated.find(
                (s) => s.user_id === profile?.id
            )?.id;
            setCurrentGameStatsId(myStatsId);
            setModalOpen(true);
        } catch (err) {
            console.error("ゲーム開始エラー:", err);
            alert("ゲーム開始に失敗しました");
        } finally {
            setStarting(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-stone-100 to-stone-200">
            <Header backHref={`/room/${table.room_id}`} title={table?.name} />

            <main className="flex-1 max-w-3xl mx-auto p-6 space-y-8">
                <button
                    onClick={handleStartGame}
                    disabled={starting || members.length === 0}
                    className={`px-6 py-3 rounded-xl font-semibold tracking-wider transition
        ${
            starting || members.length === 0
                ? "bg-stone-400 text-stone-200 cursor-not-allowed"
                : "bg-gradient-to-r from-red-700 to-red-600 text-white shadow-md hover:shadow-lg hover:scale-105"
        }
      `}
                >
                    対局開始
                </button>

                <div className="bg-white/70 rounded-2xl shadow-inner border border-stone-300 p-4">
                    <ScoreSheet
                        members={members}
                        gamesWithStats={gamesWithStats}
                        initialBonuses={bonuses}
                        onBonusChange={(b) => setBonuses(b)}
                    />
                </div>
            </main>

            {currentGameStatsId && (
                <GameStatsModal
                    gameStatsId={currentGameStatsId}
                    userId={members[0].id}
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </div>
    );
}
