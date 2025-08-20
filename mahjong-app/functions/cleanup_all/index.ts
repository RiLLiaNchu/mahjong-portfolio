import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export default async function cleanupAll() {
    const supabase = await getSupabaseAdmin();

    // 48時間以上経過したゲストを削除
    const { error: guestError } = await supabase
        .from("users")
        .delete()
        .lt(
            "created_at",
            new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
        )
        .eq("user_metadata->>is_guest", "true");

    if (guestError) {
        console.error("ゲスト削除エラー", guestError);
    } else {
        console.log("古いゲストを削除しました");
    }

    // 24時間以上経過したルームを削除
    const { error: roomError } = await supabase
        .from("rooms")
        .delete()
        .lt("expires_at", new Date().toISOString());

    if (roomError) {
        console.error("ルーム削除エラー", roomError);
    } else {
        console.log("期限切れルームを削除しました");
    }

    return { success: !guestError && !roomError };
}
