"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export const LogoutButton: React.FC<{ onAfterLogout?: () => void }> = ({
    onAfterLogout,
}) => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            // セッション情報を取得
            const {
                data: { session },
                error: sessionError,
            } = await supabase.auth.getSession();

            if (sessionError) {
                console.error(
                    "セッション取得中にエラー:",
                    sessionError.message
                );
                return;
            }

            if (!session) {
                console.warn("ログアウト前にセッションが存在しません。");
                // 必要なら強制的にトップページに飛ばす
                router.push("/");
                return;
            }

            // セッションがある場合のみログアウト
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error("ログアウト失敗:", error.message);
            } else {
                onAfterLogout?.();
                router.push("/");
            }
        } catch (err) {
            console.error("ログアウト処理中に予期せぬエラー:", err);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left w-full"
            role="menuitem"
        >
            ログアウト
        </button>
    );
};
