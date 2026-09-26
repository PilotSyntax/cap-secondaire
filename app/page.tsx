import { CapSecondaireApp } from "./components/cap-secondaire-app";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../lib/auth-current";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return <CapSecondaireApp user={{ id: user.id, displayName: user.displayName }} />;
}
