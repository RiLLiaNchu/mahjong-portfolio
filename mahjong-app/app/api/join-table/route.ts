// app/api/join-table/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        let { tableId, userId, name } = body;

        if (!tableId) {
            return new Response(
                JSON.stringify({ error: "tableId がありません" }),
                {
                    status: 400,
                }
            );
        }

        const supabaseAdmin = await getSupabaseAdmin();

        // ゲストユーザーの場合、userId がなければ新規作成
        if (!userId) {
            if (!name) {
                return new Response(
                    JSON.stringify({ error: "ゲスト名が必要です" }),
                    { status: 400 }
                );
            }

            const { data: newUser, error: userError } = await supabaseAdmin
                .from("users")
                .insert({ id: crypto.randomUUID(), name })
                .select()
                .single();

            if (userError) throw userError;
            userId = newUser.id;
        }

        // 既存の参加記録があれば削除（移動用）
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

        // 卓に参加（重複は無視）
        const { error: joinError } = await supabaseAdmin
            .from("table_members")
            .upsert(
                { table_id: tableId, user_id: userId },
                { onConflict: "table_id,user_id", ignoreDuplicates: true }
            );

        if (joinError) throw joinError;

        return NextResponse.json({ tableId, userId });
    } catch (err: any) {
        console.error("サーバー卓参加エラー:", err);
        return new Response(
            JSON.stringify({ error: err.message || "卓参加に失敗しました" }),
            { status: 500 }
        );
    }
}
