"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createTable, joinTable } from "@/lib/api/tables";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import type { Profile } from "@/contexts/auth-context";

type CreateTableDialogProps = {
    profile: Profile | null;
    roomId: string;
    onClose: () => void;
};

export const CreateTableDialog = ({
    profile,
    roomId,
    onClose,
}: CreateTableDialogProps) => {
    const router = useRouter();
    const { toast } = useToast();

    const userName = profile?.name || "名無し";
    const userId = profile?.id || "";

    const [tableName, setTableName] = useState(`${userName}の卓`);
    const [playerCount, setPlayerCount] = useState<4 | 3>(4); // 四麻 or 三麻
    const [gameType, setGameType] = useState<"半荘" | "東風">("東風");
    const [umaTop, setUmaTop] = useState(10);
    const [umaSecond, setUmaSecond] = useState(5);
    const [umaThird, setUmaThird] = useState(-5);
    const [umaFourth, setUmaFourth] = useState(-10);
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState("");

    const handleCreate = async () => {
        setCreateError("");

        if (!tableName.trim()) {
            setCreateError("卓名は必須です");
            return;
        }

        if (!userId) {
            setCreateError("ユーザー情報が取得できませんでした");
            return;
        }

        setCreating(true);

        try {
            const data = await createTable({
                roomId,
                tableName,
                playerCount,
                gameType,
                umaTop,
                umaSecond,
                umaThird,
                umaFourth,
                createdBy: userId,
            });

            toast({ title: "卓を作成しました！" });

            if (userId) {
                await joinTable(data.id, userId);
            }

            onClose();
            router.push(`/room/${roomId}/table/${data.id}`);
        } catch (error: unknown) {
            console.error("卓作成エラー:", error);

            const message =
                error instanceof Error
                    ? error.message
                    : "卓の作成に失敗しました";

            toast({
                title: message,
                variant: "destructive",
            });
        } finally {
            setCreating(false);
        }
    };

    const firstPlaceScore = -(
        umaSecond +
        umaThird +
        (playerCount === 4 ? umaFourth ?? 0 : 0)
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl p-6 w-80 space-y-4">
                <h2 className="text-xl font-bold">卓作成</h2>

                {/* 卓名を入力 */}
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="tableName">卓名</Label>
                    <Input
                        id="tableName"
                        value={tableName}
                        onChange={(e) => setTableName(e.target.value)}
                        placeholder="卓名を入力"
                    />
                </div>

                {/* 人数設定 */}
                <div className="flex flex-col space-y-2">
                    <Label>人数</Label>
                    <RadioGroup
                        value={playerCount.toString()}
                        onValueChange={(val) =>
                            setPlayerCount(Number(val) as 3 | 4)
                        }
                        className="flex gap-4"
                    >
                        <RadioGroupItem value="4" id="4players" />
                        <Label htmlFor="4players">四麻</Label>
                        <RadioGroupItem value="3" id="3players" />
                        <Label htmlFor="3players">三麻</Label>
                    </RadioGroup>
                </div>

                {/* ゲームタイプ設定 */}
                <div className="flex flex-col space-y-2">
                    <Label>ゲームタイプ</Label>
                    <RadioGroup
                        value={gameType}
                        onValueChange={(val) =>
                            setGameType(val as "半荘" | "東風")
                        }
                        className="flex gap-4"
                    >
                        <RadioGroupItem value="半荘" id="hanchan" />
                        <Label htmlFor="hanchan">半荘戦</Label>
                        <RadioGroupItem value="東風" id="tonpu" />
                        <Label htmlFor="tonpu">東風戦</Label>
                    </RadioGroup>
                </div>

                {/* 順位点 */}
                <div className="flex flex-col space-y-2">
                    <Label>順位点</Label>
                    {/* 順位点のテンプレ */}
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            onClick={() => {
                                setUmaSecond(5);
                                setUmaThird(-5);
                                setUmaFourth(-10);
                            }}
                        >
                            5-10
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => {
                                setUmaSecond(10);
                                setUmaThird(-10);
                                setUmaFourth(-20);
                            }}
                        >
                            10-20
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => {
                                setUmaSecond(10);
                                setUmaThird(-10);
                                setUmaFourth(-30);
                            }}
                        >
                            10-30
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => {
                                setUmaSecond(20);
                                setUmaThird(-20);
                                setUmaFourth(-40);
                            }}
                        >
                            20-40
                        </Button>
                    </div>

                    {/* 順位点の入力欄 */}
                    <div className="flex items-center gap-2">
                        <span className="w-8">1位</span>
                        <Input
                            type="number"
                            value={firstPlaceScore}
                            disabled
                            className="bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="w-8">2位</span>
                        <Input
                            type="number"
                            step={5}
                            min={-50}
                            max={50}
                            value={umaSecond}
                            onChange={(e) =>
                                setUmaSecond(Number(e.target.value))
                            }
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-8">3位</span>
                        <Input
                            type="number"
                            step={5}
                            min={-50}
                            max={50}
                            value={umaThird}
                            onChange={(e) =>
                                setUmaThird(Number(e.target.value))
                            }
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-8">4位</span>
                        {playerCount === 4 && (
                            <Input
                                type="number"
                                step={5}
                                min={-50}
                                max={50}
                                value={umaFourth}
                                onChange={(e) =>
                                    setUmaFourth(Number(e.target.value))
                                }
                            />
                        )}
                    </div>
                </div>
                {createError && (
                    <div className="text-red-600 text-sm mb-2">
                        {createError}
                    </div>
                )}

                <div className="flex justify-between mt-4">
                    <Button variant="secondary" onClick={onClose}>
                        キャンセル
                    </Button>
                    <Button
                        disabled={!tableName.trim() || creating}
                        onClick={handleCreate}
                    >
                        {creating ? "作成中..." : "作成"}
                    </Button>
                </div>
            </div>
        </div>
    );
};
