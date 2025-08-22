// lib/api/getRoomMembers.ts
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export interface RoomMember {
    id: string;
    user_id: string;
    user: {
        id: string;
        name: string;
        email?: string;
    };
    joined_at: string; // Date ではなく文字列にする
}

export async function getRoomMembers(roomId: string): Promise<RoomMember[]> {
    const supabaseAdmin = await getSupabaseAdmin();

    const { data: members, error } = await supabaseAdmin
        .from("room_members")
        .select(
            `
      id,
      user_id,
      joined_at,
      user:users (
        id,
        name,
        email
      )
    `
        )
        .eq("room_id", roomId)
        .order("joined_at", { ascending: true });

    if (error) throw new Error(error.message);

    // Server → Client で渡せるプレーンオブジェクトに変換
    const formattedMembers: RoomMember[] = (members ?? []).map((m: any) => ({
        id: m.id,
        user_id: m.user_id,
        joined_at: m.joined_at?.toString() ?? "",
        user: { ...(Array.isArray(m.user) ? m.user[0] : m.user) }, // プレーン化
    }));

    return formattedMembers;
}
