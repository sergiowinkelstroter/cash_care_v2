import { NextResponse, NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/session";
import {
  createBackup,
  deleteBackup,
  restoreBackup,
  restoreFullBackup,
} from "@/lib/backup-service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handleInvalidSession = () => NextResponse.json({ status: 500 });

const parseSearchParams = (request: NextRequest, params: string[]) => {
  const searchParams = request.nextUrl.searchParams;
  return params.reduce((acc, param) => {
    const value = searchParams.get(param);
    if (value === null) {
      acc.invalid = true;
    } else {
      acc[param] = value;
    }
    return acc;
  }, {} as { [key: string]: string | boolean });
};

export async function POST(request: NextRequest) {
  const session = await getCurrentUser();
  if (!session?.user.id) return handleInvalidSession();

  try {
    const backup = await createBackup(session.user.id);
    return NextResponse.json({ status: 200, backup });
  } catch (error) {
    console.error("Error creating backup:", error);
    return NextResponse.json({ status: 500 });
  }
}

export async function GET() {
  const session = await getCurrentUser();
  if (!session?.user.id) return handleInvalidSession();

  try {
    const backups = await prisma.backups.findMany();
    return NextResponse.json(backups);
  } catch (error) {
    console.error("Error fetching backups:", error);
    return NextResponse.json({ status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getCurrentUser();
  if (!session?.user.id) return handleInvalidSession();

  const { backupId, userId, invalid } = parseSearchParams(request, [
    "backupId",
    "userId",
  ]);

  if (invalid) return NextResponse.json({ status: 500 });

  try {
    await restoreBackup(Number(userId), Number(backupId));
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Error restoring backup:", error);
    return NextResponse.json({ status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getCurrentUser();
  if (!session?.user.id) return handleInvalidSession();

  const { backupId, invalid } = parseSearchParams(request, ["backupId"]);

  if (invalid) return NextResponse.json({ status: 500 });

  try {
    await restoreFullBackup(Number(backupId));
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Error restoring full backup:", error);
    return NextResponse.json({ status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getCurrentUser();
  if (!session?.user.id) return handleInvalidSession();

  const { backupId, invalid } = parseSearchParams(request, ["backupId"]);

  if (invalid) return NextResponse.json({ status: 500 });

  try {
    await deleteBackup(Number(backupId));
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Error deleting backup:", error);
    return NextResponse.json({ status: 500 });
  }
}
