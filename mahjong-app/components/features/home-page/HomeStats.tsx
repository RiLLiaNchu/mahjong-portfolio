"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface HomeStatsProps {
    userId: string;
    gameType: "sanma" | "yonma";
    gameLength: "tonpu" | "hanchan";
}

interface Stats {
    totalGames: number;
    averageRank: number;
    winRate: number;
    dealInRate: number;
}

export default function HomeStats({
    userId,
    gameType,
    gameLength,
}: HomeStatsProps) {
    const [stats, setStats] = useState<Stats>({
        totalGames: 0,
        averageRank: 0,
        winRate: 0,
        dealInRate: 0,
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        if (!userId) return;

        setLoading(true);

        const { data, error } = await supabase
            .from("game_stats")
            .select("*")
            .eq("user_id", userId)
            .eq("game_type", gameType)
            .eq("game_length", gameLength);

        if (error) {
            console.error("Supabase fetch error:", error);
            setLoading(false);
            return;
        }

        if (!data || data.length === 0) {
            setStats({
                totalGames: 0,
                averageRank: 0,
                winRate: 0,
                dealInRate: 0,
            });
            setLoading(false);
            return;
        }

        const totalGames = data.length;
        const averageRank =
            totalGames === 0
                ? 0
                : data.reduce((sum, g) => sum + (g.rank ?? 0), 0) / totalGames;
        const totalKyoku = data.reduce(
            (sum, g) => sum + (g.kyoku_count ?? 0),
            0
        );
        const totalAgari = data.reduce(
            (sum, g) => sum + (g.agari_count ?? 0),
            0
        );
        const totalDealIn = data.reduce(
            (sum, g) => sum + (g.deal_in_count ?? 0),
            0
        );

        setStats({
            totalGames,
            averageRank: parseFloat(averageRank.toFixed(2)),
            winRate:
                totalKyoku === 0
                    ? 0
                    : parseFloat(((totalAgari / totalKyoku) * 100).toFixed(1)),
            dealInRate:
                totalKyoku === 0
                    ? 0
                    : parseFloat(((totalDealIn / totalKyoku) * 100).toFixed(1)),
        });

        setLoading(false);
    }, [userId, gameType, gameLength]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loading) {
        return (
            <div className="text-center text-gray-500">
                統計データを読み込み中…
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded shadow text-center">
                <div className="text-sm text-gray-500">総試合数</div>
                <div className="text-2xl font-bold">{stats.totalGames}</div>
            </div>
            <div className="p-4 bg-white rounded shadow text-center">
                <div className="text-sm text-gray-500">平均順位</div>
                <div className="text-2xl font-bold">{stats.averageRank}</div>
            </div>
            <div className="p-4 bg-white rounded shadow text-center">
                <div className="text-sm text-gray-500">和了率 (%)</div>
                <div className="text-2xl font-bold">{stats.winRate}</div>
            </div>
            <div className="p-4 bg-white rounded shadow text-center">
                <div className="text-sm text-gray-500">放銃率 (%)</div>
                <div className="text-2xl font-bold">{stats.dealInRate}</div>
            </div>
        </div>
    );
}
