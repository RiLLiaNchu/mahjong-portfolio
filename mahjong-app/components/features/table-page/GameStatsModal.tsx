"use client";

import { useState, useEffect } from "react";
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
    const [modalOpen, setModalOpen] = useState(true);
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-stone-50/95 rounded-2xl p-6 w-96 max-w-full shadow-2xl border border-stone-300 relative">
                {/* ✕ボタン */}
                <button
                    onClick={onClose} // ← propsかstateで制御
                    className="absolute top-3 right-3 text-stone-600 hover:text-red-700 text-xl font-bold"
                >
                    ×
                </button>

                <h2 className="text-xl font-bold mb-4 text-stone-800 border-b-2 border-red-700 pb-2">
                    {step === 1 ? "基本情報入力" : "最終情報入力"}
                </h2>

                {step === 1 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-stone-300 pb-1">
                            <span className="text-stone-700 font-medium">
                                和了数
                            </span>
                            <input
                                type="number"
                                value={form.agari_count ?? 0}
                                onChange={(e) =>
                                    handleChange("agari_count", +e.target.value)
                                }
                                className="w-24 text-right px-2 py-1 rounded-md border border-stone-300 
                 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-stone-50"
                            />
                        </div>

                        <div className="flex items-center justify-between border-b border-stone-300 pb-1">
                            <span className="text-stone-700 font-medium">
                                和了合計点
                            </span>
                            <input
                                type="number"
                                step={100}
                                value={form.agari_total ?? 0}
                                onChange={(e) =>
                                    handleChange("agari_total", +e.target.value)
                                }
                                className="w-24 text-right px-2 py-1 rounded-md border border-stone-300 
                 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-stone-50"
                            />
                        </div>

                        <div className="flex items-center justify-between border-b border-stone-300 pb-1">
                            <span className="text-stone-700 font-medium">
                                放銃数
                            </span>
                            <input
                                type="number"
                                value={form.deal_in_count ?? 0}
                                onChange={(e) =>
                                    handleChange(
                                        "deal_in_count",
                                        +e.target.value
                                    )
                                }
                                className="w-24 text-right px-2 py-1 rounded-md border border-stone-300 
                 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-stone-50"
                            />
                        </div>

                        <div className="flex items-center justify-between border-b border-stone-300 pb-1">
                            <span className="text-stone-700 font-medium">
                                放銃合計点
                            </span>
                            <input
                                type="number"
                                step={100}
                                value={form.deal_in_total ?? 0}
                                onChange={(e) =>
                                    handleChange(
                                        "deal_in_total",
                                        +e.target.value
                                    )
                                }
                                className="w-24 text-right px-2 py-1 rounded-md border border-stone-300 
                 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-stone-50"
                            />
                        </div>
                        <div className="flex items-center justify-between border-b border-stone-300 pb-1">
                            <span className="text-stone-700 font-medium">
                                立直数
                            </span>
                            <input
                                type="number"
                                value={form.riichi_count ?? 0}
                                onChange={(e) =>
                                    handleChange(
                                        "riichi_count",
                                        +e.target.value
                                    )
                                }
                                className="w-24 text-right px-2 py-1 rounded-md border border-stone-300 
                 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-stone-50"
                            />
                        </div>
                        <div className="flex items-center justify-between border-b border-stone-300 pb-1">
                            <span className="text-stone-700 font-medium">
                                副露数
                            </span>
                            <input
                                type="number"
                                value={form.furo_count ?? 0}
                                onChange={(e) =>
                                    handleChange("furo_count", +e.target.value)
                                }
                                className="w-24 text-right px-2 py-1 rounded-md border border-stone-300 
                 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-stone-50"
                            />
                        </div>
                        <div className="flex items-center justify-between border-b border-stone-300 pb-1">
                            <span className="text-stone-700 font-medium">
                                局数
                            </span>
                            <input
                                type="number"
                                value={form.kyoku_count ?? 0}
                                onChange={(e) =>
                                    handleChange("kyoku_count", +e.target.value)
                                }
                                className="w-24 text-right px-2 py-1 rounded-md border border-stone-300 
                 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-stone-50"
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-stone-300 pb-1">
                            <span className="text-stone-700 font-medium">
                                最終順位
                            </span>
                            <input
                                type="number"
                                value={form.rank ?? 2}
                                onChange={(e) =>
                                    handleChange("rank", +e.target.value)
                                }
                                className="w-24 text-right px-2 py-1 rounded-md border border-stone-300 
                 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-stone-50"
                            />
                        </div>

                        <div className="flex items-center justify-between border-b border-stone-300 pb-1">
                            <span className="text-stone-700 font-medium">
                                最終点棒
                            </span>
                            <input
                                type="number"
                                step={100}
                                value={form.point ?? 25000}
                                onChange={(e) =>
                                    handleChange("point", +e.target.value)
                                }
                                className="w-24 text-right px-2 py-1 rounded-md border border-stone-300 
                 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-stone-50"
                            />
                        </div>

                        <div className="flex items-center justify-between border-b border-stone-300 pb-1">
                            <span className="text-stone-700 font-medium">
                                最終スコア
                            </span>
                            <input
                                type="number"
                                value={form.score ?? 0}
                                onChange={(e) =>
                                    handleChange("score", +e.target.value)
                                }
                                className="w-24 text-right px-2 py-1 rounded-md border border-stone-300 
                 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-stone-50"
                            />
                        </div>

                        <div className="flex items-center justify-between border-b border-stone-300 pb-1">
                            <span className="text-stone-700 font-medium">
                                役満回数
                            </span>
                            <input
                                type="number"
                                value={form.yakuman_count ?? 0}
                                onChange={(e) =>
                                    handleChange(
                                        "yakuman_count",
                                        +e.target.value
                                    )
                                }
                                className="w-24 text-right px-2 py-1 rounded-md border border-stone-300 
                 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-stone-50"
                            />
                        </div>
                        <div className="flex items-center justify-between border-b border-stone-300 pb-1">
                            <span className="text-stone-700 font-medium">
                                W役満回数
                            </span>
                            <input
                                type="number"
                                value={form.double_yakuman_count ?? 0}
                                onChange={(e) =>
                                    handleChange(
                                        "double_yakuman_count",
                                        +e.target.value
                                    )
                                }
                                className="w-24 text-right px-2 py-1 rounded-md border border-stone-300 
                 focus:ring-2 focus:ring-red-600 focus:border-red-600 bg-stone-50"
                            />
                        </div>
                    </div>
                )}

                {/* ボタン群 */}
                <div className="flex justify-between mt-6 space-x-2">
                    {step === 2 && (
                        <>
                            <button
                                onClick={() => setStep(1)}
                                className="px-4 py-2 rounded-lg bg-stone-400 text-white hover:bg-stone-500 transition"
                            >
                                戻る
                            </button>

                            <button
                                onClick={() => handleSave()}
                                disabled={saving}
                                className="px-4 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800 transition disabled:opacity-50"
                            >
                                保存して終了
                            </button>

                            <button
                                onClick={() => handleSave()}
                                disabled={saving}
                                className="px-4 py-2 rounded-lg bg-purple-700 text-white hover:bg-purple-800 transition disabled:opacity-50"
                            >
                                保存して次の対局
                            </button>
                        </>
                    )}

                    {step === 1 && (
                        <button
                            onClick={() => setStep(2)}
                            className="px-4 py-2 rounded-lg bg-red-700 text-white hover:bg-red-800 transition"
                        >
                            次へ
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
