"use client";

import { useState, useEffect } from "react";
import { updateGameStats } from "@/lib/api/gameStats";
import { GameStatsInput } from "@/lib/api/gameStats";
import { supabase } from "@/lib/supabase";

type Props = {
    gameStatsId: string;
    userId: string; // 必須ユーザーIDを明示
    initialData?: Partial<GameStatsInput>;
    open: boolean;
    onClose: () => void;
};

export const GameStatsModal = ({
    gameStatsId,
    userId,
    initialData = {},
    open,
    onClose,
}: Props) => {
    const [step, setStep] = useState(1); // 1: 基本情報 2: 最終情報
    const [form, setForm] = useState<Partial<GameStatsInput>>({
        ...initialData,
        user_id: userId, // 初期値として user_id を必ずセット
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!open) setStep(1);
        // モーダル開閉時に user_id を再セット
        setForm((prev) => ({ ...prev, user_id: userId }));
    }, [open, userId]);

    const handleChange = (field: keyof GameStatsInput, value: number) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!gameStatsId) {
            alert("更新対象のゲームデータが見つかりません💦");
            return;
        }

        try {
            // 更新前に対象レコードが存在するか確認
            const { data: existingStats, error: fetchError } = await supabase
                .from("game_stats")
                .select("*")
                .eq("id", gameStatsId)
                .maybeSingle();

            if (fetchError) throw fetchError;
            if (!existingStats) {
                alert("対象のゲームデータが存在しません");
                console.error("game_stats が存在しない:", gameStatsId);
                return;
            }

            // 更新処理
            const { data, error } = await supabase
                .from("game_stats")
                .update(form)
                .eq("id", gameStatsId)
                .maybeSingle();

            if (error) {
                console.error("game_stats 更新エラー:", error);
                alert("保存に失敗しました💦");
                return;
            }

            console.log("更新成功:", data);
            onClose(); // モーダル閉じる
        } catch (err) {
            console.error("保存処理エラー:", err);
            alert("保存中にエラーが発生しました💦");
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-full">
                <h2 className="text-xl font-bold mb-4">
                    {step === 1 ? "基本情報入力" : "最終情報入力"}
                </h2>

                {step === 1 && (
                    <div className="space-y-2">
                        <label>和了数</label>
                        <input
                            type="number"
                            value={form.agari_count ?? 0}
                            onChange={(e) =>
                                handleChange("agari_count", +e.target.value)
                            }
                            className="input"
                        />
                        <label>和了合計点</label>
                        <input
                            type="number"
                            value={form.agari_total ?? 0}
                            onChange={(e) =>
                                handleChange("agari_total", +e.target.value)
                            }
                            className="input"
                        />
                        <label>放銃数</label>
                        <input
                            type="number"
                            value={form.deal_in_count ?? 0}
                            onChange={(e) =>
                                handleChange("deal_in_count", +e.target.value)
                            }
                            className="input"
                        />
                        <label>放銃合計点</label>
                        <input
                            type="number"
                            value={form.deal_in_total ?? 0}
                            onChange={(e) =>
                                handleChange("deal_in_total", +e.target.value)
                            }
                            className="input"
                        />
                        <label>立直数</label>
                        <input
                            type="number"
                            value={form.riichi_count ?? 0}
                            onChange={(e) =>
                                handleChange("riichi_count", +e.target.value)
                            }
                            className="input"
                        />
                        <label>副露数</label>
                        <input
                            type="number"
                            value={form.furo_count ?? 0}
                            onChange={(e) =>
                                handleChange("furo_count", +e.target.value)
                            }
                            className="input"
                        />
                        <label>局数</label>
                        <input
                            type="number"
                            value={form.kyoku_count ?? 0}
                            onChange={(e) =>
                                handleChange("kyoku_count", +e.target.value)
                            }
                            className="input"
                        />
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-2">
                        <label>最終順位</label>
                        <input
                            type="number"
                            value={form.rank ?? 0}
                            onChange={(e) =>
                                handleChange("rank", +e.target.value)
                            }
                            className="input"
                        />
                        <label>最終点棒</label>
                        <input
                            type="number"
                            value={form.point ?? 0}
                            onChange={(e) =>
                                handleChange("point", +e.target.value)
                            }
                            className="input"
                        />
                        <label>最終スコア</label>
                        <input
                            type="number"
                            value={form.score ?? 0}
                            onChange={(e) =>
                                handleChange("score", +e.target.value)
                            }
                            className="input"
                        />
                        <label>役満回数</label>
                        <input
                            type="number"
                            value={form.yakuman_count ?? 0}
                            onChange={(e) =>
                                handleChange("yakuman_count", +e.target.value)
                            }
                            className="input"
                        />
                        <label>ダブル役満回数</label>
                        <input
                            type="number"
                            value={form.double_yakuman_count ?? 0}
                            onChange={(e) =>
                                handleChange(
                                    "double_yakuman_count",
                                    +e.target.value
                                )
                            }
                            className="input"
                        />
                    </div>
                )}

                <div className="flex justify-between mt-4">
                    {step === 2 && (
                        <button onClick={() => setStep(1)} className="btn-gray">
                            戻る
                        </button>
                    )}
                    {step === 1 && (
                        <button onClick={() => setStep(2)} className="btn-blue">
                            次へ
                        </button>
                    )}
                    <button
                        onClick={() => handleSave()}
                        disabled={saving}
                        className="btn-green"
                    >
                        保存して終了
                    </button>
                    <button
                        onClick={() => handleSave()}
                        disabled={saving}
                        className="btn-purple"
                    >
                        保存して次の対局
                    </button>
                </div>
            </div>
        </div>
    );
};
