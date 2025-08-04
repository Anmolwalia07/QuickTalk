import { authOptions } from "@/app/api/lib/auth";
import Chat from "@/app/Components/Chat";
import Sidebar from "@/app/Components/Sidebar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="w-full flex">
    <div className="w-1/4 lg:flex hidden "><Sidebar/></div>
    <Chat/>
    </div>
  )
}
