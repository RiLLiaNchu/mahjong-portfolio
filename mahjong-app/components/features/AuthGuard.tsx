"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();

            if (error) {
                console.error("セッション取得中のエラー:", error.message);
                setLoading(false);
                return;
            }

            if (!session) {
                // セッションがなければトップページにリダイレクト
                router.push("/");
            } else {
                // セッションがあればそのまま
                setLoading(false);
            }
        };

        checkSession();

        // セッション変更時にも対応
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, _session) => {
                if (!_session) router.push("/login");
            }
        );

        return () => {
            listener.subscription.unsubscribe();
        };
    }, [router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
};
