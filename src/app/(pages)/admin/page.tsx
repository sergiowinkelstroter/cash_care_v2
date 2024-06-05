"use server";

import { getServerSession } from "next-auth";
import { PageAdmin } from "./PageAdmin";
import { authOptions } from "@/lib/auth-configs";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

export default async function Admin() {
  const session = await getCurrentUser();

  if (!session) {
    redirect("/login");
  }

  return <PageAdmin session={session} />;
}
