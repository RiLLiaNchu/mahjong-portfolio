import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, email, name } = body;

        if (!id || !email || !name) {
            return NextResponse.json(
                { error: "必須項目が不足しています" },
                { status: 400 }
            );
        }

        const supabase = await getSupabaseAdmin();

        // ゲストユーザーをDBに追加（既存なら更新）
        const { error } = await supabase.from("users").upsert([
            {
                id,
                email,
                name,
                is_guest: true,
            },
        ]);

        if (error) {
            console.error("ゲストDB同期エラー", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "ゲスト同期完了" });
    } catch (err: any) {
        console.error("guest-sync API エラー", err);
        return NextResponse.json(
            { error: err.message || "予期せぬエラー" },
            { status: 500 }
        );
    }
}
