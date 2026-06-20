import { sql } from "@vercel/postgres";

export async function GET() {
    try {
        if (!process.env.POSTGRES_URL) {
            console.warn('[GET /api/memories] POSTGRES_URL is missing. Returning empty array.')
            return Response.json([], {
                headers: {
                    'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
                }
            })
        }

        const { rows } = await sql`
      SELECT id, image_name, image_url
      FROM memories
      ORDER BY created_at DESC
    `;

        return Response.json(rows, {
            headers: {
                'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
            }
        });
    } catch (err) {
        console.error('[GET /api/memories]', err);
        return new Response("Error", { status: 500 });
    }
}