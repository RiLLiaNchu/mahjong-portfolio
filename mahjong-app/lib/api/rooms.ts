import { supabase } from "../supabase";
import type { RoomWithAuthor } from "@/types/room";

// rooms テーブルから情報取得
export const fetchRooms = async (): Promise<RoomWithAuthor[]> => {
    const { data, error } = await supabase
        .from("rooms")
        .select(
            `
            id,
            name,
            created_at,
            created_by,
            users:created_by (
                name
            )
        `
        )
        .order("created_at", { ascending: false }); // 並び順も追加する

    if (error) {
        console.error("ルーム一覧取得に失敗:", error.message);
        return []; // エラー時は空配列を返す（アプリが落ちないように）
    }

    const roomsWithAuthor = data.map((room: any) => ({
        id: room.id,
        name: room.name,
        created_at: room.created_at,
        created_by: room.created_by,
        expires_at: room.expires_at,
        created_by_name: room.users?.name ?? "不明",
    }));
    return roomsWithAuthor;
};

// 共通: 現在ユーザーが他のルームに入っていたら退出して、指定ルームに参加する処理
export const joinRoom = async (
    roomId: string,
    password: string,
    userId?: string | null,
    nickname?: string | null
) => {
    const res = await fetch("/api/join-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            roomId,
            password,
            userId,
            nickname,
        }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "ルーム参加に失敗しました");
    }

    return res.json();
};
