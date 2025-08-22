"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export type PlayerStat = {
    player_id: string;
    name: string;
    latest_rank: number;
    latest_score: number;
    total_score: number;
};

export const MemberList = ({ stats }: { stats: PlayerStat[] }) => {
    return (
        <Card className="border-green-200 max-w-screen-lg mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                    📊 メンバー一覧
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse text-sm sm:text-base">
                        <thead>
                            <tr className="text-left text-gray-600 border-b">
                                <th className="py-2 px-3">名前</th>
                                <th className="py-2 px-3">最新順位</th>
                                <th className="py-2 px-3">最新スコア</th>
                                <th className="py-2 px-3">累計スコア</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.map((s) => (
                                <tr
                                    key={s.player_id}
                                    className="border-b last:border-0"
                                >
                                    <td className="py-2 px-3 font-medium">
                                        {s.name}
                                    </td>
                                    <td className="py-2 px-3">
                                        <span
                                            className={`
                        px-2 py-1 rounded text-white text-xs sm:text-sm
                        ${s.latest_rank === 1 ? "bg-green-500" : ""}
                        ${s.latest_rank === 2 ? "bg-blue-500" : ""}
                        ${s.latest_rank === 3 ? "bg-orange-500" : ""}
                        ${s.latest_rank === 4 ? "bg-red-500" : ""}
                      `}
                                        >
                                            {s.latest_rank}位
                                        </span>
                                    </td>
                                    <td
                                        className={`py-2 px-3 ${
                                            s.latest_score >= 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {s.latest_score > 0
                                            ? `+${s.latest_score}`
                                            : s.latest_score}
                                    </td>
                                    <td className="py-2 px-3 font-semibold">
                                        {s.total_score}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};
