"use server";

import { redirect } from "next/navigation";
import { PageBlockedUser } from "./PageBlocked";
import { getCurrentUser } from "@/lib/session";

export default async function BlockedUser() {
  const session = getCurrentUser();

  if (!session) {
    redirect("/");
  }

  return <PageBlockedUser />;
}
