import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export interface Room {
    id: string;
    name: string;
    created_by: string;
    created_at: string;
    expires_at: string | null;
    code: string;
}

export async function getRoomData(roomId: string): Promise<Room> {
    const supabaseAdmin = await getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
        .from("rooms")
        .select("*")
        .eq("id", roomId)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    if (!data) {
        throw new Error("ルームが見つかりません");
    }

    return {
        id: data.id,
        name: data.name,
        created_by: data.created_by,
        created_at: data.created_at,
        expires_at: data.expires_at,
        code: data.code,
    };
}
