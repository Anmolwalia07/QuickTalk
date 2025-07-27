import { authOptions } from "@/app/api/lib/auth";
import Chat from "@/app/Components/Chat";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
    return null;
  }

  return <Chat />;
}
