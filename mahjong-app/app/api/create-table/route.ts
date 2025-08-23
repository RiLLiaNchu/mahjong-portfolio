import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type CreateTableParams = {
    roomId: string;
    tableName: string;
    playerCount: 3 | 4;
    gameType: "東風" | "半荘";
    umaTop: number;
    umaSecond: number;
    umaThird: number;
    umaFourth: number | null;
    createdBy: string;
};

export async function POST(req: NextRequest) {
    try {
        const body: CreateTableParams = await req.json();

        const supabaseAdmin = await getSupabaseAdmin();

        // まず tables に卓を作成
        const { data: tableData, error: tableError } = await supabaseAdmin
            .from("tables")
            .insert([
                {
                    room_id: body.roomId,
                    name: body.tableName,
                    game_type: body.playerCount === 4 ? "yonma" : "sanma",
                    game_length: body.gameType === "東風" ? "tonpu" : "hanchan",
                    uma_top: body.umaTop,
                    uma_second: body.umaSecond,
                    uma_third: body.umaThird,
                    uma_fourth: body.playerCount === 4 ? body.umaFourth : null,
                    created_by: body.createdBy,
                },
            ])
            .select("id")
            .single();

        if (tableError || !tableData) {
            console.error("卓作成エラー:", tableError);
            return NextResponse.json(
                { error: "卓作成に失敗しました" },
                { status: 500 }
            );
        }

        // 作成者を table_members に追加（既存卓から削除）
        const { data: currentTables, error: fetchError } = await supabaseAdmin
            .from("table_members")
            .select("table_id")
            .eq("user_id", body.createdBy);

        if (fetchError) {
            console.error("既存卓取得エラー:", fetchError);
            return NextResponse.json(
                { error: fetchError.message },
                { status: 500 }
            );
        }

        const otherTables =
            currentTables?.filter((t) => t.table_id !== tableData.id) ?? [];
        if (otherTables.length > 0) {
            const { error: deleteError } = await supabaseAdmin
                .from("table_members")
                .delete()
                .in(
                    "table_id",
                    otherTables.map((t) => t.table_id)
                )
                .eq("user_id", body.createdBy);

            if (deleteError) {
                console.error("既存卓削除エラー:", deleteError);
                return NextResponse.json(
                    { error: deleteError.message },
                    { status: 500 }
                );
            }
        }

        // 卓に参加
        const { error: joinError, data: memberData } = await supabaseAdmin
            .from("table_members")
            .upsert(
                { table_id: tableData.id, user_id: body.createdBy },
                { onConflict: "table_id,user_id", ignoreDuplicates: true }
            )
            .select()
            .single();

        if (joinError) {
            console.error("メンバー追加エラー:", joinError);
            return NextResponse.json(
                { error: "卓作成はできたけどメンバー追加に失敗しました" },
                { status: 500 }
            );
        }

        return NextResponse.json({ table: tableData, member: memberData });
    } catch (err) {
        console.error("API エラー:", err);
        return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
    }
}
