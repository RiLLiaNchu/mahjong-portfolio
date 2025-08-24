"use client";

import React, { useEffect, useState } from "react";
import { Member, GameWithStats } from "@/types/game";
import { makeScoreSheetWithBonus } from "@/lib/utils/scoreSheet";

type Props = {
    members: Member[];
    gamesWithStats: GameWithStats[];
    // 外部からボーナスを渡せるようにしてリアルタイム対応
    initialBonuses?: Record<string, number>;
    onBonusChange?: (bonuses: Record<string, number>) => void;
};

export const ScoreSheet = ({
    members,
    gamesWithStats,
    initialBonuses = {},
    onBonusChange,
}: Props) => {
    const [bonuses, setBonuses] =
        useState<Record<string, number>>(initialBonuses);

    // 親コンポーネントにボーナス変更を通知
    useEffect(() => {
        if (onBonusChange) onBonusChange(bonuses);
    }, [bonuses, onBonusChange]);

    // ゲームデータやボーナスが変わるたびにシート更新
    const sheet = makeScoreSheetWithBonus(members, gamesWithStats, bonuses);

    const handleBonusChange = (playerId: string, value: number) => {
        setBonuses((prev) => ({ ...prev, [playerId]: value }));
    };

    return (
        <div className="overflow-x-auto">
            <table className="table-auto border-collapse w-full">
                <thead>
                    <tr>
                        <th className="border px-2 py-1 text-left">項目</th>
                        {members.map((m) => (
                            <th
                                key={m.id}
                                className="border px-2 py-1 text-center"
                            >
                                {m.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sheet.map((row, i) => (
                        <tr key={i}>
                            <td className="border px-2 py-1 font-bold">
                                {row.label}
                            </td>
                            {members.map((m) => {
                                if (row.label === "ボーナス") {
                                    return (
                                        <td
                                            key={m.id}
                                            className="border px-2 py-1 text-center"
                                        >
                                            <input
                                                type="number"
                                                value={bonuses[m.id] ?? 0}
                                                onChange={(e) =>
                                                    handleBonusChange(
                                                        m.id,
                                                        +e.target.value
                                                    )
                                                }
                                                className="w-16 text-center border rounded"
                                            />
                                        </td>
                                    );
                                } else {
                                    return (
                                        <td
                                            key={m.id}
                                            className="border px-2 py-1 text-center"
                                        >
                                            {row[m.id]}
                                        </td>
                                    );
                                }
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
