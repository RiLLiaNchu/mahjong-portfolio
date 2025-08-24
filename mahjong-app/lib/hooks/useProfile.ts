"use client";

import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export type Profile = {
    id: string;
    name: string;
    gamesPlayed: number;
    winRate: number;
    averageScore: number;
};

export const useProfile = () => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isGuest, setIsGuest] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();

                if (!user) {
                    // ログインしてない場合はゲスト扱い
                    setIsGuest(true);
                    setProfile({
                        id: "guest",
                        name: "ゲスト",
                        gamesPlayed: 0,
                        winRate: 0,
                        averageScore: 0,
                    });
                    setLoading(false);
                    return;
                }

                // Supabase の profiles テーブルからデータ取得
                const { data, error } = await supabase
                    .from("users")
                    .select("id, name")
                    .eq("id", user.id)
                    .single();

                if (error || !data) {
                    console.error("プロフィール取得エラー:", error);
                    setProfile({
                        id: user.id,
                        name: user.email || "ユーザー",
                        gamesPlayed: 0,
                        winRate: 0,
                        averageScore: 0,
                    });
                } else {
                    setProfile({
                        id: data.id,
                        name: data.name,
                        gamesPlayed: data.games_played,
                        winRate: data.win_rate,
                        averageScore: data.average_score,
                    });
                }

                setIsGuest(false);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return { profile, isGuest, loading };
};
