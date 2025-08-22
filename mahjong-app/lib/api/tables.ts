import { supabase } from "../supabase";

export const joinTable = async (tableId: string, userId: string) => {
    // 既存卓から削除（移動時用）
    await supabase.from("table_players").delete().eq("user_id", userId);

    // 卓に参加
    await supabase
        .from("table_players")
        .insert({ table_id: tableId, user_id: userId });

    return true;
};
