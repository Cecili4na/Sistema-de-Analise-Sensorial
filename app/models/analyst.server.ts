import { prisma } from "~/db.server";

interface Address {
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
}

interface Analyst {
  name: string | null;
  cpf: string | null;
  email: string | null;
  phone: string | null;
  address: Address;
  experience: string | null;
}

export async function createAnalyst(data: Analyst) {
  return prisma.analyst.create({
    data: {
      name: data.name,
      cpf: data.cpf,
      email: data.email,
      phone: data.phone,
      experience: data.experience,
      address: {
        create: {
          street: data.address.street,
          number: data.address.number,
          complement: data.address.complement,
          neighborhood: data.address.neighborhood,
          city: data.address.city,
          state: data.address.state,
          zipCode: data.address.zipCode,
        }
      }
    }
  });
}

export async function getAnalysts() {
  return prisma.analyst.findMany({
    include: {
      address: true
    }
  });
}

export async function getAnalyst(id: string) {
  return prisma.analyst.findUnique({
    where: { id },
    include: {
      address: true
    }
  });
}
