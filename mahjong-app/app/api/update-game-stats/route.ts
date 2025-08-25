import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
    const supabaseAdmin = await getSupabaseAdmin();

    try {
        const { gameStatsId, formData } = await req.json();

        // 対象データ確認
        const { data: existingStats, error: fetchError } = await supabaseAdmin
            .from("game_stats")
            .select("*")
            .eq("id", gameStatsId)
            .maybeSingle();

        if (fetchError) throw fetchError;
        if (!existingStats) {
            return NextResponse.json(
                { error: "対象のゲームデータが存在しません" },
                { status: 404 }
            );
        }

        // 更新処理
        const { data, error } = await supabaseAdmin
            .from("game_stats")
            .update(formData)
            .eq("id", gameStatsId)
            .maybeSingle();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (err: any) {
        console.error("API更新エラー:", err);
        return NextResponse.json(
            { error: err.message || "更新処理でエラー" },
            { status: 500 }
        );
    }
}
