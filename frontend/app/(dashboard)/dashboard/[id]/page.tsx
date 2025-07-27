import { authOptions } from "@/app/api/lib/auth";
import Chat from "@/app/Components/Chat";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/login");
  }
  const { id } = params;
  return (
    <Chat/>
  );
}
