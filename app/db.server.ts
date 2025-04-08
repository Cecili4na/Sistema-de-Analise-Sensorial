import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

declare global {
  // eslint-disable-next-line no-var
  var __db__: PrismaClient | undefined;
}

// Verificar se estamos em ambiente de build
const isBuild = process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "production";

if (isBuild) {
  // Durante o build, criar uma instância vazia do PrismaClient
  prisma = {} as PrismaClient;
} else if (process.env.NODE_ENV === "production") {
  try {
    prisma = new PrismaClient();
  } catch (error) {
    console.error("Erro ao criar PrismaClient:", error);
    prisma = {} as PrismaClient;
  }
} else {
  if (!global.__db__) {
    try {
      global.__db__ = new PrismaClient();
    } catch (error) {
      console.error("Erro ao criar PrismaClient:", error);
      global.__db__ = {} as PrismaClient;
    }
  }
  prisma = global.__db__;
}

export { prisma }; 