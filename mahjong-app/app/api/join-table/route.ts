// app/api/join-table/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
    try {
        const { tableId, userId } = await req.json();

        if (!tableId) {
            return new Response(
                JSON.stringify({ error: "tableId がありません" }),
                { status: 400 }
            );
        }

        const supabaseAdmin = await getSupabaseAdmin();

        // 既存の参加記録があれば削除（移動用）
        if (userId) {
            const { data: currentTables, error: fetchError } =
                await supabaseAdmin
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

                if (deleteError) throw new Error(deleteError.message);
            }
        }

        // 卓に参加（重複は無視）
        const { data: joinData, error: joinError } = await supabaseAdmin
            .from("table_members")
            .upsert(
                { table_id: tableId, user_id: userId },
                { onConflict: "table_id,user_id", ignoreDuplicates: true }
            );

        if (joinError) throw joinError;

        const member = joinData?.[0] ?? null;

        return NextResponse.json({ success: true, member });
    } catch (err: any) {
        console.error("サーバー卓参加エラー:", err);
        return new Response(
            JSON.stringify({ error: err.message || "卓参加に失敗しました" }),
            { status: 500 }
        );
    }
}
