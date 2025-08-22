"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, Plus, Settings } from "lucide-react";
import { Header } from "@/components/ui/header";
import { AuthGuard } from "@/components/features/AuthGuard";
import { useAuth } from "@/contexts/auth-context";
import { HomeStatsSelector } from "@/components/features/home-page/HomeStatsSelector";

type GameType = "sanma" | "yonma";
type GameLength = "tonpu" | "hanchan";

export default function HomePage() {
    const router = useRouter();
    const { profile, isGuest, loading } = useAuth();

    const [gameType, setGameType] = useState<GameType>("yonma");
    const [gameLength, setGameLength] = useState<GameLength>("hanchan");

    useEffect(() => {
        if (!loading && !profile && !isGuest) {
            router.push("/");
        }
    }, [profile, isGuest, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!profile) return null;

    const userName = profile.name || "ユーザー";
    const isAdmin = profile.is_admin || false;

    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50">
                <Header
                    icon={<div className="text-2xl">🀄</div>}
                    title={
                        <div>
                            <div>麻雀戦績管理</div>
                            <p className="text-sm text-gray-600">
                                おかえりなさい、{userName}さん
                            </p>
                        </div>
                    }
                />

                {isGuest && (
                    <div className="text-center text-sm text-gray-700 bg-yellow-50 p-2 rounded mt-2 mb-4">
                        👤 ゲストユーザーとして利用中です
                    </div>
                )}

                <div className="container mx-auto px-4 py-6 space-y-6">
                    {/* 統計サマリー */}
                    <HomeStatsSelector userId={profile.id} />

                    {/* アクションボタン */}
                    <div className="space-y-3">
                        <Button
                            asChild
                            className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg"
                        >
                            <Link href="/room-list">
                                <Plus className="h-5 w-5 mr-2" />
                                ルームに参加する
                            </Link>
                        </Button>

                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                asChild
                                variant="outline"
                                className="py-6 bg-transparent"
                            >
                                <Link href="/mydata">
                                    <BarChart3 className="h-5 w-5 mr-2" />
                                    マイデータ
                                </Link>
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                className="py-6 bg-transparent"
                            >
                                <Link href="/settings">
                                    <Settings className="h-5 w-5 mr-2" />
                                    設定
                                </Link>
                            </Button>
                        </div>

                        {isAdmin && (
                            <Button
                                asChild
                                variant="outline"
                                className="w-full py-6 bg-transparent"
                            >
                                <Link href="/admin">
                                    <Users className="h-5 w-5 mr-2" />
                                    管理者ページ
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}
