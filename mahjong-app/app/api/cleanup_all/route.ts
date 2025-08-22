import cleanupAll from "@/functions/cleanup_all";

export async function GET() {
    try {
        const result = await cleanupAll();
        return new Response(JSON.stringify(result), {
            status: result.success ? 200 : 500,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err: any) {
        return new Response(
            JSON.stringify({ success: false, error: err.message }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
