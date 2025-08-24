import { supabase } from "../supabase";

export type CreateTableParams = {
    roomId: string;
    tableName: string;
    playerCount: 3 | 4;
    gameType: "東風" | "半荘";
    umaTop: number;
    umaSecond: number;
    umaThird: number;
    umaFourth: number | null;
    createdBy: string;
};

export type Member = {
    id: string;
    name: string;
};

export type TableWithMembers = {
    id: string;
    name: string;
    members: Member[];
};

export const fetchTables = async (
    roomId: string
): Promise<TableWithMembers[]> => {
    const { data, error } = await supabase
        .from("tables")
        .select(
            `
            id,
            name,
            table_members (
                user_id,
                users (
                    id,
                    name
                )
            )
        `
        )
        .eq("room_id", roomId);

    if (error) {
        console.error("卓一覧取得に失敗:", error.message);
        return [];
    }

    return (data || []).map((t: any) => ({
        id: t.id,
        name: t.name,
        members: (t.table_members || []).map((tm: any) => ({
            id: tm.users?.id,
            name: tm.users?.name ?? "名無し",
        })),
    }));
};

// lib/api/tables.ts
export const joinTable = async (
    tableId: string,
    userId?: string,
    name?: string // ゲスト名用
) => {
    try {
        const res = await fetch("/api/join-table", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ tableId, userId, name }),
        });

        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || "卓参加に失敗しました");
        }

        const data = await res.json();
        return data; // { tableId, userId } が返る
    } catch (err: any) {
        console.error("フロント卓参加エラー:", err);
        throw err;
    }
};

// 卓作成
export const createTable = async (params: CreateTableParams) => {
    try {
        const res = await fetch("/api/create-table", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(params),
        });

        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || "卓作成に失敗しました");
        }

        const data = await res.json();
        return data;
    } catch (err: any) {
        console.error("フロント卓作成エラー:", err);
        throw err;
    }
};
