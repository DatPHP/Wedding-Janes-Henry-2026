export async function POST(req: Request) {
    const { password } = await req.json();
  
    if (password !== process.env.ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ message: "Wrong password" }),
        { status: 401 }
      );
    }
  
    return Response.json({
      token: process.env.ADMIN_TOKEN,
    });
  }
  