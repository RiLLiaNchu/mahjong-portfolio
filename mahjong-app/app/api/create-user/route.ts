import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { id, name, email } = await req.json();

        const { data, error } = await supabaseAdmin
            .from("users")
            .upsert({ id, name, email, is_admin: false, is_guest: false })
            .select()
            .single();

        if (error)
            return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
