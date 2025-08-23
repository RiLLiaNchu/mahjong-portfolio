// app/api/tables/route.ts
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
    try {
        // // 1. tables を取得
        // const { data: tablesData, error: tablesError } = await supabase
        //     .from("tables")
        //     .select("id, name");

        // if (tablesError) throw tablesError;

        // 2. table_members と users を取得
        const { data: membersData, error: membersError } = await supabase.from(
            "table_members"
        ).select(`
        table_id,
        users (
          id,
          name
        )
      `);

        if (membersError) throw membersError;

        // 3. table_id ごとにメンバーをまとめる
        const tableMap: Record<string, { id: string; name: string }[]> = {};
        membersData.forEach((m: any) => {
            if (!tableMap[m.table_id]) tableMap[m.table_id] = [];
            if (m.users) {
                const user = Array.isArray(m.users) ? m.users[0] : m.users;
                tableMap[m.table_id].push({
                    id: user?.id ?? "",
                    name: user?.name ?? "不明ユーザー",
                });
            }
        });

        // // 4. tables に members をセット
        // const tables = tablesData.map((t: any) => ({
        //     id: t.id,
        //     name: t.name,
        //     members: tableMap[t.id] ?? [],
        // }));

        const result = Object.entries(tableMap).map(([table_id, members]) => ({
            table_id,
            members,
        }));

        console.log("table-members API result:", result);

        return new Response(JSON.stringify(result), { status: 200 });
    } catch (err: any) {
        return new Response(
            JSON.stringify({ error: err.message || "取得失敗" }),
            {
                status: 500,
            }
        );
    }
}
