import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/session";
const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params || !params.id) {
    return NextResponse.json({ status: 500 });
  }

  const id = params.id;
  const session = await getCurrentUser();
  if (session?.user.id === undefined) return NextResponse.json({ status: 500 });

  await prisma.movement.deleteMany({
    where: {
      id: Number(id),
      userId: session.user.id,
    },
  });

  return NextResponse.json({ status: 200 });
}
