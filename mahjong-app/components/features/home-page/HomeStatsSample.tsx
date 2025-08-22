"use client";
import { useState } from "react";

const sampleStats = {
    sanma: {
        tonpu: { totalGames: 5, averageRank: 2.0, winRate: 50, dealInRate: 10 },
        hanchan: {
            totalGames: 10,
            averageRank: 2.5,
            winRate: 45,
            dealInRate: 12,
        },
    },
    yonma: {
        tonpu: { totalGames: 8, averageRank: 2.3, winRate: 40, dealInRate: 15 },
        hanchan: {
            totalGames: 12,
            averageRank: 2.1,
            winRate: 42,
            dealInRate: 11,
        },
    },
};

export default function HomeStatsSample() {
    const [gameType, setGameType] = useState<"sanma" | "yonma">("yonma");
    const [gameLength, setGameLength] = useState<"tonpu" | "hanchan">(
        "hanchan"
    );

    const stats = sampleStats[gameType][gameLength];

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <select
                    value={gameType}
                    onChange={(e) => setGameType(e.target.value as any)}
                >
                    <option value="sanma">三麻</option>
                    <option value="yonma">四麻</option>
                </select>
                <select
                    value={gameLength}
                    onChange={(e) => setGameLength(e.target.value as any)}
                >
                    <option value="tonpu">東風戦</option>
                    <option value="hanchan">半荘戦</option>
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                        {stats.winRate}%
                    </div>
                    <div className="text-sm text-gray-600">和了率</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                        {stats.dealInRate}%
                    </div>
                    <div className="text-sm text-gray-600">放銃率</div>
                </div>
            </div>
        </div>
    );
}
