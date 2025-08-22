"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Profile = {
    id: string;
    name?: string | null;
    email?: string | null;
    is_admin?: boolean | null;
    is_guest?: boolean | null;
    updated_at?: string | null;
};

type AuthContextType = {
    authUser: Profile | null;
    profile: Profile | null;
    loading: boolean;
    isGuest: boolean;
    isAdmin: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    signInAsGuest: (name: string) => Promise<void>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [authUser, setAuthUser] = useState<Profile | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);

    const isAdmin = profile?.is_admin === true;

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("id", userId)
                .single();
            if (error) {
                console.warn("profile fetch warning:", error.message);
                setProfile(null);
                return null;
            }
            setProfile(data as Profile);
            return data as Profile;
        } catch (err) {
            console.error("fetchProfile error:", err);
            setProfile(null);
            return null;
        }
    };

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        if (!data.user) throw new Error("ユーザー情報が取得できません");

        const userId = data.user.id;
        await fetchProfile(userId);

        setAuthUser({
            id: userId,
            name: data.user.user_metadata?.name ?? email,
            email,
            is_guest: false,
        });
        setIsGuest(false);
    };

    const signUp = async (email: string, password: string, name: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name } },
        });
        if (error) throw error;
        if (!data.user) throw new Error("ユーザー情報が取得できません");

        const userId = data.user.id;

        const { data: userData, error: insertError } = await supabase
            .from("users")
            .upsert({
                id: userId,
                name,
                email,
                is_admin: false,
                is_guest: false,
            })
            .select()
            .single();

        if (insertError) throw insertError;

        setAuthUser(userData);
        setProfile(userData);
        setIsGuest(false);
    };

    const signInAsGuest = async (guestNickname: string) => {
        try {
            const res = await fetch("/api/guest-signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: guestNickname }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(
                    errData.error || "ゲストログインに失敗しました"
                );
            }

            const userData = await res.json();

            // Client 側の state 更新
            setAuthUser({ id: userData.id, email: userData.email });
            setProfile({ id: userData.id, name: userData.name });
            setIsGuest(true);

            return userData;
        } catch (err: any) {
            console.error("ゲスト同期APIエラー", err);
            throw err;
        }
    };

    const signOut = async () => {
        try {
            if (isGuest) {
                setAuthUser(null);
                setProfile(null);
                setIsGuest(false);
                return;
            }
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            setAuthUser(null);
            setProfile(null);
        } catch (err) {
            console.error("ログアウトエラー:", err);
            setAuthUser(null);
            setProfile(null);
        }
    };

    const refreshProfile = async () => {
        if (!authUser) return;
        await fetchProfile(authUser.id);
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();
                if (session?.user) {
                    const userId = session.user.id;
                    await fetchProfile(userId);
                    setAuthUser({
                        id: userId,
                        name:
                            session.user.user_metadata?.name ??
                            session.user.email ??
                            "",
                        email: session.user.email,
                        is_guest: false,
                    });
                    setIsGuest(false);
                }
            } catch (err) {
                console.error("init auth error:", err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                authUser,
                profile,
                loading,
                isGuest,
                isAdmin,
                signIn,
                signUp,
                signInAsGuest,
                signOut,
                refreshProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
