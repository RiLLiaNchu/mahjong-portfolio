"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export const LogoutButton: React.FC<{ onAfterLogout?: () => void }> = ({
    onAfterLogout,
}) => {
    const router = useRouter();
    const { signOut } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            await signOut(); // authUser を null にリセット
            onAfterLogout?.();
            router.push("/"); // ← ここでトップページへ
        } catch (err) {
            console.error("ログアウト中にエラー:", err);
            router.push("/"); // 念のためトップへ
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className={`px-4 py-2 text-sm text-red-600 text-left w-full ${
                loading ? "bg-gray-100 cursor-not-allowed" : "hover:bg-red-50"
            }`}
            role="menuitem"
        >
            {loading ? "ログアウト中..." : "ログアウト"}
        </button>
    );
};
