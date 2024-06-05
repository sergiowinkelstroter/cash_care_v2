"use server";

import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { PageTestOver } from "./PageTestOver";

export default async function TestOver() {
  const session = await getCurrentUser();

  if (!session) {
    redirect("/");
  }

  return <PageTestOver />;
}
