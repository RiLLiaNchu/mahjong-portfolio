import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function cleanupExpiredRooms() {
  const supabaseAdmin = await getSupabaseAdmin();

  // 期限切れルームを取得
  const { data: rooms, error } = await supabaseAdmin
    .from("rooms")
    .select("id")
    .lt("expires_at", new Date().toISOString());

  if (error) {
    console.error("Failed to fetch expired rooms:", error);
    return;
  }

  for (const room of rooms || []) {
    const roomId = room.id;

    // 関連テーブルも削除
    await supabaseAdmin.from("game_stats").delete().eq("room_id", roomId);
    await supabaseAdmin.from("games").delete().eq("room_id", roomId);
    await supabaseAdmin.from("table_players").delete().eq("room_id", roomId);
    await supabaseAdmin.from("tables").delete().eq("room_id", roomId);
    await supabaseAdmin.from("room_members").delete().eq("room_id", roomId);

    // 最後にルーム自体を削除
    const { error: deleteError } = await supabaseAdmin
      .from("rooms")
      .delete()
      .eq("id", roomId);

    if (deleteError) console.error(`Failed to delete room ${roomId}:`, deleteError);
    else console.log(`Deleted room ${roomId}`);
  }
}

// Vercel 用エクスポート
export default async function handler() {
  await cleanupExpiredRooms();
  return new Response(JSON.stringify({ status: "done" }));
}
