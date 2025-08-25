"use client";

import { useState, useEffect } from "react";
import { GameStatsInput, updateGameStats } from "@/lib/api/gameStats";
import { GameWithStats } from "@/types/game";
import { NumberRow } from "./LabelInput";
import { NumberStepperRow } from "./NumberStepperRow";

type Props = {
    gamesWithStats: GameWithStats[];
    gameStatsId: string;
    userId: string;
    initialData?: Partial<GameStatsInput>;
    open: boolean;
    onClose: () => void;
};

const pointSuggestions = [
    1000, 1300, 2000, 2600, 3900, 5200, 7700, 8000, 11600, 12000,
];

const usePoints = (
    fieldName: keyof GameStatsInput,
    handleChange: (field: keyof GameStatsInput, value: number) => void
) => {
    const [input, setInput] = useState(0);
    const [points, setPoints] = useState<number[]>([]);

    const addPoint = () => {
        if (input !== 0) {
            const newPoints = [...points, input];
            setPoints(newPoints);
            setInput(0);
            handleChange(
                fieldName,
                newPoints.reduce((sum, p) => sum + p, 0)
            );
        }
    };

    return { input, setInput, points, addPoint };
};

export const GameStatsModal = ({
    gamesWithStats,
    gameStatsId,
    userId,
    initialData = {},
    open,
    onClose,
}: Props) => {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState<Partial<GameStatsInput>>({
        ...initialData,
        user_id: userId,
    });
    const [saving, setSaving] = useState(false);

    const handleChange = (field: keyof GameStatsInput, value: number) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const agari = usePoints("agari_total", handleChange);
    const dealIn = usePoints("deal_in_total", handleChange);
    const [kyokuAuto, setKyokuAuto] = useState(true);

    useEffect(() => {
        if (!open) setStep(1);
        setForm((prev) => ({ ...prev, user_id: userId }));
    }, [open, userId]);

    const handleSave = async () => {
        if (!gameStatsId) {
            alert("更新対象のゲームデータが見つかりません💦");
            return;
        }
        try {
            await updateGameStats(gameStatsId, form);
            console.log("更新成功");
            onClose();
        } catch (err: any) {
            console.error("保存処理エラー:", err);
            alert(err.message || "保存中にエラーが発生しました💦");
        }
    };

    const handleAgariChange = (val: number) => {
        setForm((prev) => {
            const agariDiff = val - (prev.agari_count ?? 0);
            const newKyoku =
                prev.kyoku_count !== undefined
                    ? prev.kyoku_count + agariDiff
                    : (prev.deal_in_count ?? 0) + val;
            return {
                ...prev,
                agari_count: val,
                kyoku_count: kyokuAuto
                    ? newKyoku
                    : (prev.kyoku_count ?? 0) + agariDiff,
            };
        });
    };

    const handleDealInChange = (val: number) => {
        setForm((prev) => {
            const dealInDiff = val - (prev.deal_in_count ?? 0);
            return {
                ...prev,
                deal_in_count: val,
                kyoku_count: kyokuAuto
                    ? (prev.agari_count ?? 0) + val
                    : (prev.kyoku_count ?? 0) + dealInDiff,
            };
        });
    };

    const handleKyokuChange = (val: number) => {
        setForm((prev) => ({ ...prev, kyoku_count: val }));
        setKyokuAuto(false); // 手動変更したら自動計算オフ
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-stone-50/95 rounded-2xl p-6 w-96 max-w-full shadow-2xl border border-stone-300 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-stone-600 hover:text-red-700 text-xl font-bold"
                >
                    ×
                </button>

                <h2 className="text-xl font-bold mb-4 text-stone-800 border-b-2 border-red-700 pb-2">
                    第 {gamesWithStats.length + 1} 試合目 -{" "}
                    {step === 1
                        ? "対局情報"
                        : step === 2
                        ? "対局結果"
                        : "入力待機"}
                </h2>

                {/* ステップ1 */}
                {step === 1 && (
                    <div className="space-y-3">
                        <NumberStepperRow
                            label="和了数"
                            value={form.agari_count ?? 0}
                            onChange={handleAgariChange}
                        />
                        <NumberRow
                            label="和了点"
                            value={agari.input}
                            onChange={agari.setInput}
                            step={100}
                            suggestions={pointSuggestions}
                            withAddButton
                            addAction={agari.addPoint}
                            total={form.agari_total}
                        />
                        <NumberStepperRow
                            label="放銃数"
                            value={form.deal_in_count ?? 0}
                            onChange={handleDealInChange}
                        />
                        <NumberRow
                            label="放銃点"
                            value={dealIn.input}
                            onChange={dealIn.setInput}
                            step={100}
                            suggestions={pointSuggestions}
                            withAddButton
                            addAction={dealIn.addPoint}
                            total={form.deal_in_total}
                        />
                        <NumberStepperRow
                            label="立直数"
                            value={form.riichi_count ?? 0}
                            onChange={(v) => handleChange("riichi_count", v)}
                        />
                        <NumberStepperRow
                            label="副露数"
                            value={form.furo_count ?? 0}
                            onChange={(v) => handleChange("furo_count", v)}
                        />
                        <NumberStepperRow
                            label="局数"
                            value={form.kyoku_count ?? 0}
                            onChange={handleKyokuChange}
                        />
                    </div>
                )}

                {/* ステップ2 */}
                {step === 2 && (
                    <div className="space-y-3">
                        <NumberStepperRow
                            label="最終順位"
                            value={form.rank ?? 2}
                            min={1}
                            max={4}
                            onChange={(v) => handleChange("rank", v)}
                        />
                        <NumberRow
                            label="最終点棒"
                            value={form.point ?? 25000}
                            onChange={(v) => handleChange("point", v)}
                            step={100}
                        />
                        <NumberRow
                            label="最終スコア"
                            value={form.score ?? 0}
                            onChange={(v) => handleChange("score", v)}
                        />
                        <NumberStepperRow
                            label="役満回数"
                            value={form.yakuman_count ?? 0}
                            onChange={(v) => handleChange("yakuman_count", v)}
                        />
                        <NumberStepperRow
                            label="W役満回数"
                            value={form.double_yakuman_count ?? 0}
                            onChange={(v) =>
                                handleChange("double_yakuman_count", v)
                            }
                        />
                    </div>
                )}

                {/* ステップ3 */}
                {step === 3 && (
                    <div className="text-center space-y-4">
                        <p className="text-stone-700 font-medium">
                            他メンバーの入力を待っています…
                        </p>
                    </div>
                )}

                {/* ボタン */}
                <div className="flex justify-between mt-6 space-x-2">
                    {step !== 1 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="px-4 py-2 rounded-lg bg-stone-400 text-white hover:bg-stone-500 transition"
                        >
                            戻る
                        </button>
                    )}
                    {step === 3 && (
                        <>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800 transition"
                            >
                                保存
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 rounded-lg bg-purple-700 text-white hover:bg-purple-800 transition"
                            >
                                保存して次の対局へ
                            </button>
                        </>
                    )}
                    {step !== 3 && (
                        <button
                            onClick={() => setStep(step + 1)}
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
