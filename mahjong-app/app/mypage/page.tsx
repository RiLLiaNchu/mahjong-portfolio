"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/ui/header";
import { AuthGuard } from "@/components/features/AuthGuard";
import { UserStatsTabs } from "@/components/features/my-page/UserStatsTabs";
import { useProfile } from "@/lib/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import { formatStats } from "@/lib/utils/formatStats";
import { GameStats, StatsRecord } from "@/types/mypage";
import {
    Card,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const MyPage: React.FC = () => {
    const { profile } = useProfile();
    const [stats, setStats] = useState<StatsRecord>({
        "yonma-hanchan": [],
        "yonma-tonpu": [],
        "sanma-hanchan": [],
        "sanma-tonpu": [],
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!profile?.id) return;

        const fetchStats = async () => {
            const isGuest = profile.id === "guest";
            if (isGuest) {
                setStats({
                    "yonma-hanchan": [],
                    "yonma-tonpu": [],
                    "sanma-hanchan": [],
                    "sanma-tonpu": [],
                });
                setErrorMessage("未認証ユーザーは戦績を表示できません");
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase.rpc(
                    "get_user_game_stats",
                    { uid: profile.id }
                );

                if (error) {
                    console.error("戦績取得エラー:", error);
                } else {
                    setStats(formatStats(data as GameStats[]));
                }
            } catch (err: any) {
                console.error("戦績取得中の例外:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [profile?.id]);

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white text-stone-800">
                {/* ヘッダー */}
                <Header
                    backHref="/home"
                    title={
                        <div className="text-center">
                            <div className="text-2xl font-bold tracking-wide text-red-800">
                                マイページ
                            </div>
                            <p className="text-sm text-stone-600 mt-1">
                                おかえりなさい、{profile?.name || "ユーザー"}
                                さん
                            </p>
                        </div>
                    }
                />

                <div className="container mx-auto px-4 py-8 space-y-8">
                    {/* プロフィールカード */}
                    {/* <Card className="border-red-200 bg-white/90 shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-700">
                                🀄 プロフィール
                            </CardTitle>
                            <CardDescription>
                                名前：{profile?.name || "ゲスト"} <br />
                                ユーザーID：{profile?.id}
                            </CardDescription>
                        </CardHeader>
                    </Card> */}

                    {/* 戦績カード */}
                    <Card className="border-green-200 bg-white/90 shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-700">
                                📊 マイデータ
                            </CardTitle>
                        </CardHeader>
                        <div className="px-4">
                            {loading ? (
                                <p className="text-center text-stone-500 animate-pulse">
                                    読み込み中…
                                </p>
                            ) : (
                                <UserStatsTabs stats={stats} />
                            )}
                            {errorMessage && (
                                <p className="text-red-600 text-sm mt-4 text-center">
                                    {errorMessage}
                                </p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </AuthGuard>
    );
};

export default MyPage;
