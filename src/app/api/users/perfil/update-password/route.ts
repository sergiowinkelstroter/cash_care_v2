import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { getCurrentUser } from "@/lib/session";
const prisma = new PrismaClient();

const handleInvalidSession = () => NextResponse.json({ status: 500 });

export async function PATCH(request: NextRequest) {
  const session = await getCurrentUser();
  if (session?.user.id === undefined) return handleInvalidSession();

  const body = await request.json();

  const { oldPassword, newPassword } = body;

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }

  if (!bcrypt.compareSync(oldPassword, user.password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  const updatedUser = await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      password: passwordHash,
    },
  });

  return NextResponse.json(updatedUser, { status: 200 });
}

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  const { id, password } = body;

  const session = await getCurrentUser();
  if (session?.user.id === undefined) return handleInvalidSession();

  if (!id || !password) {
    return NextResponse.json(
      { error: "ID or password not provided" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const updatedUser = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      password: passwordHash,
    },
  });

  return NextResponse.json(updatedUser, { status: 200 });
}
