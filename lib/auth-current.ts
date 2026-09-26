import { headers } from "next/headers";
import { getUserFromCookie } from "./auth-server";

export async function getCurrentUser() {
  const requestHeaders = await headers();
  return getUserFromCookie(requestHeaders.get("cookie"));
}
