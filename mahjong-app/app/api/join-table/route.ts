import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
    try {
        const { tableId, userId } = await req.json();
        const supabaseAdmin = await getSupabaseAdmin();

        // 既存卓から削除（移動時用）
        const { data: currentTables, error: fetchError } = await supabaseAdmin
            .from("table_members")
            .select("table_id")
            .eq("user_id", userId);

        if (fetchError) throw fetchError;

        const otherTables =
            currentTables?.filter((t) => t.table_id !== tableId) ?? [];
        if (otherTables.length > 0) {
            const { error: deleteError } = await supabaseAdmin
                .from("table_members")
                .delete()
                .in(
                    "table_id",
                    otherTables.map((t) => t.table_id)
                )
                .eq("user_id", userId);

            if (deleteError) throw deleteError;
        }

        // 卓に参加
        const { error: joinError } = await supabaseAdmin
            .from("table_members")
            .upsert(
                { table_id: tableId, user_id: userId ?? null },
                { onConflict: "table_id,user_id", ignoreDuplicates: true }
            )
            .select();

        if (joinError) throw joinError;

        return new Response(JSON.stringify(true), { status: 200 });
    } catch (err: any) {
        console.error("サーバー卓参加エラー:", err);
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
        });
    }
}
