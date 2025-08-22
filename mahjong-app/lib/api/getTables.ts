import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export interface Table {
    id: string;
    name: string;
    game_type: string;
    players: { id: string; name: string }[];
}

export async function getTables(roomId: string): Promise<Table[]> {
    const supabaseAdmin = await getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
        .from("tables")
        .select(
            `
      id,
      name,
      game_type,
      players:table_players (
        id,
        name
      )
    `
        )
        .eq("room_id", roomId);

    if (error) throw new Error(error.message);

    return (data ?? []).map((t: any) => ({
        id: t.id,
        name: t.name,
        game_type: t.game_type,
        players: t.players ?? [],
    }));
}
