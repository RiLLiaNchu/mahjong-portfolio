// app/api/tables/route.ts
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const roomId = url.searchParams.get("roomId");

    if (!roomId) {
        return new Response(JSON.stringify({ error: "roomId が必要です" }), {
            status: 400,
        });
    }

    try {
        // ルーム内の卓だけ取得
        const { data: tablesData, error } = await supabase
            .from("tables")
            .select("id, name")
            .eq("room_id", roomId);

        if (error) throw error;

        return new Response(JSON.stringify(tablesData), { status: 200 });
    } catch (err: any) {
        return new Response(
            JSON.stringify({ error: err.message || "取得失敗" }),
            { status: 500 }
        );
    }
}
