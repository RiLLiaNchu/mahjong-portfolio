// app/api/create-game/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
    try {
        const { tableId, members } = await req.json();

        if (!tableId || !Array.isArray(members) || members.length === 0) {
            return NextResponse.json(
                { error: "テーブルIDとメンバー情報は必須" },
                { status: 400 }
            );
        }

        const supabaseAdmin = await getSupabaseAdmin();

        // 最新ゲーム番号取得
        const { data: lastGame, error: lastGameError } = await supabaseAdmin
            .from("games")
            .select("game_number")
            .eq("table_id", tableId)
            .order("game_number", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (lastGameError) throw lastGameError;

        const nextGameNumber = lastGame?.game_number
            ? lastGame.game_number + 1
            : 1;

        // ゲーム作成
        const { data: newGame, error: newGameError } = await supabaseAdmin
            .from("games")
            .insert([
                {
                    table_id: tableId,
                    game_number: nextGameNumber,
                    created_at: new Date().toISOString(),
                },
            ])
            .select("*")
            .single();

        if (newGameError) throw newGameError;

        // stats 作成
        const statsInserts = members.map((m: { id: string }) => ({
            game_id: newGame.id,
            user_id: m.id,
            rank: 0,
            point: 0,
            score: 0,
            chip: 0,
            agari_count: 0,
            agari_total: 0,
            deal_in_count: 0,
            deal_in_total: 0,
            riichi_count: 0,
            furo_count: 0,
            kyoku_count: 0,
            yakuman_count: 0,
            double_yakuman_count: 0,
        }));

        const { data: stats, error: statsError } = await supabaseAdmin
            .from("game_stats")
            .insert(statsInserts)
            .select("*");

        if (statsError) throw statsError;

        return NextResponse.json({ newGame, stats });
    } catch (err: any) {
        console.error("ゲーム作成APIエラー:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
