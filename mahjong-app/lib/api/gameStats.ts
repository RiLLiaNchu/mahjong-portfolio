type Step1Data = {
    agariCount: number;
    agariTotal: number;
    dealInCount: number;
    dealInTotal: number;
    riichiCount: number;
    furoCount: number;
    kyokuCount: number;
};

type Step2Data = {
    rank: number;
    finalPoint: number;
    finalScore: number;
    yakuman: boolean;
    doubleYakuman: boolean;
};

type GameModalProps = {
    open: boolean;
    onClose: () => void;
    tableId: string;
    users: { id: string; name: string }[];
};

export type GameStatsInput = {
    gameStatsId?: string;
    user_id: string;
    agari_count: number;
    agari_total: number;
    deal_in_count: number;
    deal_in_total: number;
    riichi_count: number;
    furo_count: number;
    kyoku_count: number;
    rank: number;
    point: number;
    score: number;
    yakuman_count: number;
    double_yakuman_count: number;
};

import { supabase } from "@/lib/supabase";
import { useState } from "react";

export const GameInputModal = ({
    open,
    onClose,
    tableId,
    users,
}: GameModalProps) => {
    const [step, setStep] = useState(1);
    const [step1, setStep1] = useState<Step1Data>({
        agariCount: 0,
        agariTotal: 0,
        dealInCount: 0,
        dealInTotal: 0,
        riichiCount: 0,
        furoCount: 0,
        kyokuCount: 0,
    });
    const [step2, setStep2] = useState<Step2Data>({
        rank: 1,
        finalPoint: 0,
        finalScore: 0,
        yakuman: false,
        doubleYakuman: false,
    });

    const handleNext = () => setStep(2);
    const handleBack = () => setStep(1);

    const handleSave = async (nextGame = false) => {
        try {
            // 1. 新しいゲームを作成
            const { data: newGame, error: gameError } = await supabase
                .from("games")
                .insert([{ table_id: tableId, game_number: 1 }])
                .select()
                .single();
            if (gameError || !newGame)
                throw gameError ?? new Error("ゲーム作成に失敗");

            // 2. 各ユーザーの game_stats を作成
            const statsInsert = users.map((u) => ({
                game_id: newGame.id,
                user_id: u.id,
                rank: step2.rank,
                point: step2.finalPoint,
                score: step2.finalScore,
                chip: 0,
                agari_count: step1.agariCount,
                agari_total: step1.agariTotal,
                deal_in_count: step1.dealInCount,
                deal_in_total: step1.dealInTotal,
                riichi_count: step1.riichiCount,
                furo_count: step1.furoCount,
                kyoku_count: step1.kyokuCount,
                yakuman_count: step2.yakuman ? 1 : 0,
                double_yakuman_count: step2.doubleYakuman ? 1 : 0,
                game_type: "yonma", // 固定例。tablesの値を入れてもOK
                game_length: "hanchan", // 固定例
            }));

            const { error: statsError } = await supabase
                .from("game_stats")
                .insert(statsInsert);
            if (statsError) throw statsError;

            alert("保存成功！");

            if (!nextGame) onClose();
            else {
                // 次の試合用に入力値をリセット
                setStep1({
                    agariCount: 0,
                    agariTotal: 0,
                    dealInCount: 0,
                    dealInTotal: 0,
                    riichiCount: 0,
                    furoCount: 0,
                    kyokuCount: 0,
                });
                setStep2({
                    rank: 1,
                    finalPoint: 0,
                    finalScore: 0,
                    yakuman: false,
                    doubleYakuman: false,
                });
                setStep(1);
            }
        } catch (err: any) {
            console.error("保存エラー:", err);
            alert("保存に失敗しました");
        }
    };
};

export const updateGameStats = async (gameStatsId: string, formData: any) => {
    try {
        const res = await fetch("/api/update-game-stats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameStatsId, formData }),
        });

        if (!res.ok) {
            const errData = await res.json();
            throw new Error(
                errData.error || "ゲームデータの更新に失敗しました"
            );
        }

        const data = await res.json();
        return data;
    } catch (err: any) {
        throw err;
    }
};
