"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/ui/header";
import { AuthGuard } from "@/components/features/AuthGuard";
import { UserStatsTabs } from "@/components/features/my-page/UserStatsTabs";
import { useProfile } from "@/lib/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import { formatStats } from "@/lib/utils/formatStats";
import { GameStats, StatsRecord } from "@/types/mypage";

const MyPage: React.FC = () => {
    const { profile } = useProfile();
    const [stats, setStats] = useState<StatsRecord>({
        "yonma-hanchan": [],
        "yonma-tonpu": [],
        "sanma-hanchan": [],
        "sanma-tonpu": [],
    });
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
                setStats(formatStats(data as GameStats[]));
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
                    ) : (
                        <UserStatsTabs stats={stats} />
                    )}
                </div>
            </div>
        </AuthGuard>
    );
};

export default MyPage;
