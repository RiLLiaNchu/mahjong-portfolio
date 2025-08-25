// app/api/join-room/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
    try {
        const { roomId, password, userId } = await req.json();

        if (!roomId || !password) {
            return NextResponse.json(
                { error: "必要な情報が不足しています" },
                { status: 400 }
            );
        }

        const supabaseAdmin = await getSupabaseAdmin();

        // ルームのパスワードチェック
        const { data: roomData, error: roomError } = await supabaseAdmin
            .from("rooms")
            .select("id")
            .eq("id", roomId)
            .eq("password", password)
            .single();

        if (roomError || !roomData) {
            return NextResponse.json(
                { error: "パスワードが違います" },
                { status: 400 }
            );
        }

        // 他のルームに参加していたら退出
        if (userId) {
            const { data: currentRooms, error: fetchError } =
                await supabaseAdmin
                    .from("room_members")
                    .select("room_id")
                    .eq("user_id", userId);

            if (fetchError) throw new Error(fetchError.message);

            const otherRooms =
                currentRooms?.filter((r) => r.room_id !== roomId) ?? [];
                
            if (otherRooms.length > 0) {
                const { error: deleteError } = await supabaseAdmin
                    .from("room_members")
                    .delete()
                    .in(
                        "room_id",
                        otherRooms.map((r) => r.room_id)
                    )
                    .eq("user_id", userId);

                if (deleteError) throw new Error(deleteError.message);
            }
        }

        // ルーム参加情報を upsert（重複は無視）
        const { data: joinData, error: joinError } = await supabaseAdmin
            .from("room_members")
            .upsert(
                { room_id: roomId, user_id: userId ?? null },
                { onConflict: "room_id,user_id", ignoreDuplicates: true }
            )
            .select();

        if (joinError) throw new Error(joinError.message);

        // 配列の先頭を返す（既存レコードがあればそれを返す）
        const member = joinData?.[0] ?? null;

        return NextResponse.json({ success: true, member });
    } catch (err: any) {
        console.error("join-room API error:", err);
        return NextResponse.json(
            { error: err.message || "入室できませんでした" },
            { status: 500 }
        );
    }
}
