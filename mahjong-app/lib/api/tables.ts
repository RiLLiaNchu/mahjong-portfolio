import { supabase } from "../supabase";

type CreateTableParams = {
    roomId: string;
    tableName: string;
    playerCount: 3 | 4;
    gameType: "東風" | "半荘";
    umaTop: number;
    umaSecond: number;
    umaThird: number;
    umaFourth: number | null;
};

export const joinTable = async (tableId: string, userId: string) => {
    // 既存卓から削除（移動時用）
    await supabase.from("table_players").delete().eq("user_id", userId);

    // 卓に参加
    await supabase
        .from("table_players")
        .insert({ table_id: tableId, user_id: userId });

    return true;
};

// 卓作成
export const createTable = async ({
    roomId,
    tableName,
    playerCount,
    gameType,
    umaTop,
    umaSecond,
    umaThird,
    umaFourth,
}: CreateTableParams) => {
    const { data, error } = await supabase.from("tables").insert({
        room_id: roomId,
        name: tableName,
        game_type: playerCount === 4 ? "yonma" : "sanma",
        game_length: gameType === "東風" ? "tonpu" : "hanchan",
        uma_top: umaTop,
        uma_second: umaSecond,
        uma_third: umaThird,
        uma_fourth: playerCount === 4 ? umaFourth : null,
    });
    if (error) throw error;
    return data;
};
