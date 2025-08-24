"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/ui/header";
import { AuthGuard } from "@/components/features/AuthGuard";
import { UserStatsTable } from "@/components/features/my-page/UserStatsTable";
import { useProfile } from "@/lib/hooks/useProfile";
import { supabase } from "@/lib/supabase";

type GameStats = {
    game_type: string;
    game_length: string;
    total_games: number;
    avg_rank: number;
    win_rate: number;
    second_rate: number;
    third_rate: number;
    fourth_rate: number;
    avg_score: number;
    total_score: number;
    agari_rate: number;
    avg_agari: number;
    deal_in_rate: number;
    avg_deal_in: number;
    riichi_rate: number;
    furo_rate: number;
    yakuman_count: number;
    double_yakuman_count: number;
};

const MyPage: React.FC = () => {
    const { profile } = useProfile();
    const [stats, setStats] = useState<GameStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!profile?.id) return;

        const fetchStats = async () => {
            const { data, error } = await supabase.rpc("get_user_game_stats", {
                uid: profile.id,
            });

            if (error) {
                console.error("戦績取得エラー:", error);
            } else {
                setStats(data as GameStats[]);
            }
            setLoading(false);
        };

        fetchStats();
    }, [profile?.id]);

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50">
                <Header
                    backHref="/home"
                    title={
                        <div>
                            <div>マイページ</div>
                            <p className="text-sm text-gray-600">
                                おかえりなさい、{profile?.name || "ユーザー"}
                                さん
                            </p>
                        </div>
                    }
                />

                <div className="container mx-auto px-4 py-6 space-y-6">
                    {loading ? (
                        <p className="text-center text-gray-500">読み込み中…</p>
                    ) : stats.length === 0 ? (
                        <p className="text-center text-gray-500">
                            まだ戦績がありません
                        </p>
                    ) : (
                        <UserStatsTable stats={stats} />
                    )}
                </div>
            </div>
        </AuthGuard>
    );
};

export default MyPage;
