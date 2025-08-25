"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { signIn } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return; // 二重送信防止
        setLoading(true);
        setError("");

        // エラーメッセージを判定する関数
        const getErrorMessage = (msg?: string) => {
            if (!msg) return "ログイン中にエラーが発生しました。";
            return msg.toLowerCase().includes("invalid login credentials")
                ? "メールアドレスまたはパスワードが正しくありません。"
                : "ログイン中に予期せぬエラーが発生しました。";
        };

        try {
            await signIn(email, password); // Supabase 等のログイン処理
            // 成功時に軽くメッセージを出したい場合
            toast({
                title: "ログイン成功✨",
                description: "ホーム画面に移動します",
            });
            router.push("/home");
        } catch (err: any) {
            const msg = getErrorMessage(err?.message);
            // 画面上とトーストの両方で表示
            setError(msg);
            toast({
                variant: "destructive",
                title: "ログイン失敗",
                description: msg,
            });
            console.error("ログインエラー:", err);
        } finally {
            setLoading(false); // ここは必ず呼ぶ
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            <div className="container mx-auto px-4 py-8">
                {/* ヘッダー */}
                <div className="flex items-center mb-8">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/">
                            <ArrowLeft className="h-6 w-6" />
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold ml-4">ログイン</h1>
                </div>

                <Card className="max-w-md mx-auto">
                    <CardHeader className="text-center">
                        <div className="text-4xl mb-2">🀄</div>
                        <CardTitle>おかえりなさい</CardTitle>
                        <CardDescription>
                            アカウントにログインして戦績管理を続けましょう
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">メールアドレス</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">パスワード</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="パスワードを入力"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700"
                                disabled={loading}
                            >
                                {loading ? "ログイン中..." : "ログイン"}
                            </Button>
                        </form>

                        <div className="mt-6 space-y-4">
                            <div className="text-center">
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-green-600 hover:underline"
                                >
                                    パスワードを忘れた方はこちら
                                </Link>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-gray-500">
                                        または
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Button
                                    variant="outline"
                                    className="w-full bg-transparent"
                                    type="button"
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    Googleでログイン
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full bg-transparent"
                                    type="button"
                                >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                    </svg>
                                    Appleでログイン
                                </Button>
                            </div>

                            <div className="text-center text-sm">
                                <span className="text-gray-600">
                                    アカウントをお持ちでない方は{" "}
                                </span>
                                <Link
                                    href="/signup"
                                    className="text-green-600 hover:underline"
                                >
                                    新規登録
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
