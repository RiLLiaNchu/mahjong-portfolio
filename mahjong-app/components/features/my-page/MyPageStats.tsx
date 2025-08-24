"use client";

import React, { useEffect, useState } from "react";
import { useProfile } from "@/lib/hooks/useProfile";

type Stats = {
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

export const MyPageStats: React.FC = () => {
    const { profile, isGuest } = useProfile();
    const [stats, setStats] = useState<Stats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!profile) return;

        const fetchStats = async () => {
            setLoading(true);
            const res = await fetch(`/api/mypage/stats?userId=${profile.id}`);
            const data = await res.json();
            setStats(data);
            setLoading(false);
        };

        fetchStats();
    }, [profile]);

    if (loading) return <div>読み込み中…</div>;
    if (isGuest) return null;

    return (
        <div className="space-y-4">
            {stats.map((s) => (
                <div
                    key={`${s.game_type}-${s.game_length}`}
                    className="border p-3 rounded shadow-sm bg-white"
                >
                    <h2 className="font-bold text-lg mb-2">
                        {s.game_type === "4" ? "四麻" : "三麻"} ×{" "}
                        {s.game_length === "1" ? "東風" : "半荘"}
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                        <div>総対局数: {s.total_games}</div>
                        <div>平均順位: {s.avg_rank.toFixed(2)}</div>
                        <div>1位率: {(s.win_rate * 100).toFixed(1)}%</div>
                        <div>2位率: {(s.second_rate * 100).toFixed(1)}%</div>
                        <div>3位率: {(s.third_rate * 100).toFixed(1)}%</div>
                        <div>4位率: {(s.fourth_rate * 100).toFixed(1)}%</div>
                        <div>平均スコア: {s.avg_score.toFixed(1)}</div>
                        <div>総スコア: {s.total_score}</div>
                        <div>和了率: {(s.agari_rate * 100).toFixed(1)}%</div>
                        <div>平均和了点: {s.avg_agari.toFixed(1)}</div>
                        <div>放銃率: {(s.deal_in_rate * 100).toFixed(1)}%</div>
                        <div>平均放銃点: {s.avg_deal_in.toFixed(1)}</div>
                        <div>立直率: {(s.riichi_rate * 100).toFixed(1)}%</div>
                        <div>副露率: {(s.furo_rate * 100).toFixed(1)}%</div>
                        <div>役満回数: {s.yakuman_count}</div>
                        <div>ダブル役満回数: {s.double_yakuman_count}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};
