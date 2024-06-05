import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/session";
const prisma = new PrismaClient();
const handleInvalidSession = () => NextResponse.json({ status: 500 });

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params || !params.id) {
    return handleInvalidSession();
  }

  const id = params.id;
  const session = await getCurrentUser();
  if (session?.user.id === undefined) return handleInvalidSession();

  await prisma.movement.deleteMany({
    where: {
      id: Number(id),
      userId: session.user.id,
    },
  });

  return NextResponse.json({ status: 200 });
}
