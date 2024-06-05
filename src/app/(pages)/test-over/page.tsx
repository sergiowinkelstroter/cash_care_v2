"use server";

import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { PageTestOver } from "./PageTestOver";

export default function TestOver() {
  const session = getCurrentUser();

  if (!session) {
    redirect("/");
  }

  return <PageTestOver />;
}
