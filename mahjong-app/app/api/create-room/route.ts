import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { name, password, createdBy, expiresAt } = await req.json();

        if (!name || !password || !createdBy || !expiresAt) {
            return NextResponse.json(
                { error: "必要な情報が不足しています" },
                { status: 400 }
            );
        }

        const { data, error } = await supabaseAdmin
            .from("rooms")
            .insert([
                {
                    name,
                    password,
                    created_by: createdBy,
                    expires_at: expiresAt,
                },
            ])
            .select("id")
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (err: any) {
        console.error("create-room error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
