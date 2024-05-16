import { getServerSession } from "next-auth";
import { authOptions } from "./auth-configs";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  return session;
}
