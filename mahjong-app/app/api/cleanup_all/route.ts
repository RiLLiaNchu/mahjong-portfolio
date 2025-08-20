// app/api/cleanup_all/route.ts
import cleanupAll from "@/functions/cleanup_all";

export async function GET() {
    const result = await cleanupAll();
    return new Response(JSON.stringify(result), {
        status: result.success ? 200 : 500,
        headers: { "Content-Type": "application/json" },
    });
}
