import { deleteSession, expiredSessionCookie } from "../../../../lib/auth-server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  await deleteSession(request.headers.get("cookie"));
  return new Response(null, {
    status: 303,
    headers: { Location: "/login", "Cache-Control": "no-store", "Set-Cookie": expiredSessionCookie() },
  });
}
