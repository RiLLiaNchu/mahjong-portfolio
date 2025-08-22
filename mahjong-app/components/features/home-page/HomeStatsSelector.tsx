"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Stats {
    totalGames: number;
    averageRank: number;
    agariRate: number;
    dealInRate: number;
    lastPlayed?: string;
}

interface HomeStatsSelectorProps {
    userId: string;
}

export const HomeStatsSelector: React.FC<HomeStatsSelectorProps> = ({
    userId,
}) => {
    const [gameType, setGameType] = useState<"sanma" | "yonma">("yonma");
    const [gameLength, setGameLength] = useState<"tonpu" | "hanchan">(
        "hanchan"
    );
    const [stats, setStats] = useState<Stats>({
        totalGames: 0,
        averageRank: 0,
        agariRate: 0,
        dealInRate: 0,
        lastPlayed: undefined,
    });

    useEffect(() => {
        const fetchStats = async () => {
            const { data, error } = await supabase
                .from("game_stats")
                .select("*")
                .eq("user_id", userId)
                .eq("game_type", gameType)
                .eq("game_length", gameLength);

            if (error) {
                console.error(error);
                return;
            }

            if (!data || data.length === 0) {
                setStats({
                    totalGames: 0,
                    averageRank: 0,
                    agariRate: 0,
                    dealInRate: 0,
                    lastPlayed: undefined,
                });
                return;
            }

            const totalGames = data.length;
            const averageRank =
                data.reduce((sum, g) => sum + g.rank, 0) / totalGames;
            const totalKyoku = data.reduce((sum, g) => sum + g.kyoku_count, 0);
            const totalAgari = data.reduce((sum, g) => sum + g.agari_count, 0);
            const totalDealIn = data.reduce(
                (sum, g) => sum + g.deal_in_count,
                0
            );

            const lastGame = data.reduce((prev, current) =>
                new Date(prev.played_at) > new Date(current.played_at)
                    ? prev
                    : current
            );

            setStats({
                totalGames,
                averageRank: Number(averageRank.toFixed(2)),
                agariRate: totalKyoku
                    ? Number(((totalAgari / totalKyoku) * 100).toFixed(1))
                    : 0,
                dealInRate: totalKyoku
                    ? Number(((totalDealIn / totalKyoku) * 100).toFixed(1))
                    : 0,
                lastPlayed: lastGame.played_at
                    ? new Date(lastGame.played_at).toLocaleDateString()
                    : undefined,
            });
        };

        fetchStats();
    }, [userId, gameType, gameLength]);

    return (
        <div className="space-y-4">
            {/* 選択ボックス */}
            <div className="flex gap-4">
                <select
                    value={gameType}
                    onChange={(e) =>
                        setGameType(e.target.value as "sanma" | "yonma")
                    }
                    className="border rounded px-2 py-1"
                >
                    <option value="sanma">三麻</option>
                    <option value="yonma">四麻</option>
                </select>
                <select
                    value={gameLength}
                    onChange={(e) =>
                        setGameLength(e.target.value as "tonpu" | "hanchan")
                    }
                    className="border rounded px-2 py-1"
                >
                    <option value="tonpu">東風戦</option>
                    <option value="hanchan">半荘戦</option>
                </select>
            </div>

            {/* 戦績カード */}
            <Card>
                <CardHeader>
                    <CardTitle>あなたの戦績</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                            {stats.totalGames}
                        </div>
                        <div className="text-sm text-gray-600">総試合数</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                            {stats.averageRank}
                        </div>
                        <div className="text-sm text-gray-600">平均順位</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">
                            {stats.agariRate}%
                        </div>
                        <div className="text-sm text-gray-600">和了率</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                            {stats.dealInRate}%
                        </div>
                        <div className="text-sm text-gray-600">放銃率</div>
                    </div>
                    {stats.lastPlayed && (
                        <div className="col-span-2 text-center p-3 bg-purple-50 rounded-lg">
                            <div className="text-sm text-purple-700">
                                前回の試合日
                            </div>
                            <div className="text-lg font-bold text-purple-900">
                                {stats.lastPlayed}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
