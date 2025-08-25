"use client";

import { GameStats } from "@/types/mypage";
import React from "react";

type Props = {
    stats: GameStats[];
};

export const UserStatsTable: React.FC<Props> = ({ stats }) => {
    const labels = [
        "対局数：",
        "平均順位：",
        "偏差値：",
        "1位率：",
        "2位率：",
        "3位率：",
        "4位率：",
        "平均スコア：",
        "総スコア：",
        "和了率：",
        "平均和了点：",
        "放銃率：",
        "平均放銃点：",
        "立直率：",
        "副露率：",
        "役満回数：",
        "W役満回数：",
    ];
    return (
        <div className="flex flex-col gap-4">
            {stats.map((s, idx) => (
                <div
                    key={idx}
                    className="bg-rose-50 p-4 rounded-xl shadow-md border border-rose-100 flex flex-col md:table w-full "
                >
                    {labels.map((label, i) => (
                        <div
                            key={i}
                            className="flex justify-between md:table-row border-b last:border-b-0 px-2 py-1"
                        >
                            <span className="font-medium md:table-cell text-center text-gray-700">
                                {label}
                            </span>
                            <span className="md:table-cell text-gray-900">
                                {(() => {
                                    switch (i) {
                                        case 0:
                                            return s.total_games + " 局";
                                        case 1:
                                            return (
                                                s.avg_rank.toFixed(2) + " 位"
                                            );
                                        case 2: // 偏差値
                                            const deviation =
                                                Math.round(
                                                    (50 +
                                                        (10 *
                                                            (2.491 -
                                                                s.avg_rank)) /
                                                            0.0705) *
                                                        10
                                                ) / 10;
                                            return deviation;
                                        case 3:
                                            return (
                                                (s.win_rate * 100).toFixed(1) +
                                                " %"
                                            );
                                        case 4:
                                            return (
                                                (s.second_rate * 100).toFixed(
                                                    1
                                                ) + " %"
                                            );
                                        case 5:
                                            return (
                                                (s.third_rate * 100).toFixed(
                                                    1
                                                ) + " %"
                                            );
                                        case 6:
                                            return (
                                                (s.fourth_rate * 100).toFixed(
                                                    1
                                                ) + " %"
                                            );
                                        case 7:
                                            return s.avg_score.toFixed(1);
                                        case 8:
                                            return s.total_score.toFixed(0);
                                        case 9:
                                            return (
                                                (s.agari_rate * 100).toFixed(
                                                    1
                                                ) + " %"
                                            );
                                        case 10:
                                            return (
                                                s.avg_agari.toFixed(0) + " 点"
                                            );
                                        case 11:
                                            return (
                                                (s.deal_in_rate * 100).toFixed(
                                                    1
                                                ) + " %"
                                            );
                                        case 12:
                                            return (
                                                s.avg_deal_in.toFixed(0) + " 点"
                                            );
                                        case 13:
                                            return (
                                                (s.riichi_rate * 100).toFixed(
                                                    1
                                                ) + " %"
                                            );
                                        case 14:
                                            return (
                                                (s.furo_rate * 100).toFixed(1) +
                                                " %"
                                            );
                                        case 15:
                                            return s.yakuman_count + " 回";
                                        case 16:
                                            return (
                                                s.double_yakuman_count + " 回"
                                            );
                                        default:
                                            return "";
                                    }
                                })()}
                            </span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
