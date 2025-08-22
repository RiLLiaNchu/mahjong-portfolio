import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json(
                { error: "名前が必要です" },
                { status: 400 }
            );
        }

        const supabaseAdmin = await getSupabaseAdmin();

        // 1. UUID とダミーのメール・パスワードを作成
        const guestId = crypto.randomUUID();
        const guestEmail = `${guestId}@example.com`;
        const dummyPassword = crypto.randomUUID();

        // 2. auth.users に作成
        const { data: authUser, error: authError } =
            await supabaseAdmin.auth.admin.createUser({
                id: guestId,
                email: guestEmail,
                password: dummyPassword,
            });
        if (authError) throw authError;

        // 3. users テーブルに upsert
        const { data: userData, error: insertError } = await supabaseAdmin
            .from("users")
            .upsert(
                {
                    id: guestId,
                    name,
                    email: guestEmail,
                    is_admin: false,
                    is_guest: true,
                },
                { onConflict: "id" }
            )
            .select()
            .single();
        if (insertError) throw insertError;

        // 4. クライアントに返す
        return NextResponse.json({
            id: guestId,
            name,
            email: guestEmail,
            is_guest: true,
        });
    } catch (err: any) {
        console.error("ゲストサインインAPIエラー", err);
        return NextResponse.json(
            { error: err.message ?? "サーバーエラー" },
            { status: 500 }
        );
    }
}
