import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";
const prisma = new PrismaClient();

const createUserSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  perfil: z.string(),
});

export async function POST(request: NextRequest) {
  const body = await request.json();

  const validatedData = createUserSchema.parse(body);
  const { name, email, password, perfil } = validatedData;

  // let email = "sergio@gmail.com";
  // let name = "Sergio";
  // let password = "123456";
  // let perfil = "admin";

  const isUserExists = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (isUserExists) {
    return NextResponse.json(
      { error: "Usuario ja cadastrado" },
      { status: 400 }
    );
  }

  let passwordHash = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      perfil,
    },
  });

  const newUnit = await prisma.unit.create({
    data: {
      description: "Default",
      userId: newUser.id,
    },
  });

  return NextResponse.json({ newUser }, { status: 201 });
}

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function PUT(request: NextRequest) {
  const search = request.nextUrl.searchParams;
  const id = search.get("id");
  const situacao = search.get("situacao");
  if (!id || isNaN(Number(id)) || !situacao) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  let newUser;

  if (situacao === "I") {
    newUser = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        situacao: "A",
      },
    });
  } else if (situacao === "A") {
    newUser = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        situacao: "I",
      },
    });
  }

  return NextResponse.json({ newUser }, { status: 200 });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, name, email, perfil } = body;

  const updatedUser = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      name,
      email,
      perfil,
    },
  });
  return NextResponse.json({ updatedUser }, { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const search = request.nextUrl.searchParams;
  const id = search.get("id");
  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  // Excluir contas a pagar relacionadas com unidades do usuário
  await prisma.payable.deleteMany({
    where: {
      unit: {
        userId: Number(id),
      },
    },
  });

  // Excluir movimentos relacionados com unidades do usuário
  await prisma.movement.deleteMany({
    where: {
      unit: {
        userId: Number(id),
      },
    },
  });

  // Excluir unidades do usuário
  await prisma.unit.deleteMany({
    where: {
      userId: Number(id),
    },
  });

  // Excluir categorias do usuário
  await prisma.category.deleteMany({
    where: {
      userId: Number(id),
    },
  });

  // Excluir movimentos do usuário
  await prisma.movement.deleteMany({
    where: {
      userId: Number(id),
    },
  });

  // Excluir contas a pagar do usuário
  await prisma.payable.deleteMany({
    where: {
      userId: Number(id),
    },
  });

  // Excluir parcelas do usuário
  await prisma.installment.deleteMany({
    where: {
      userId: Number(id),
    },
  });

  // Finalmente, excluir o usuário
  await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });

  return NextResponse.json({ status: 200 });
}
