"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

interface AuthGuardProps {
    children: ReactNode;
    requireAdmin?: boolean; // 管理者専用ページ用
}

export const AuthGuard = ({
    children,
    requireAdmin = false,
}: AuthGuardProps) => {
    const { authUser, loading, isGuest, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // 読み込み中は何もしない
        if (loading) return;

        // 認証されていないか、ゲストじゃない場合
        if (!authUser && !isGuest) {
            router.replace("/login");
            return;
        }

        // 管理者ページの場合、管理者でないならホームへ
        if (requireAdmin && !isAdmin) {
            router.replace("/home");
        }
    }, [authUser, isGuest, isAdmin, loading, router, requireAdmin]);

    // 読み込み中は何も表示せず待つ
    if (loading || (!authUser && !isGuest)) {
        return <div>読み込み中…</div>;
    }

    return <>{children}</>;
};
