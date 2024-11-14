import { hash, compare } from "bcryptjs";
import { prisma } from "@/lib/db";

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Email not found");
  }

  const isValid = await compare(password, user.password);
  if (!isValid) {
    throw new Error("Invalid password");
  }

  return { user };
};

export const register = async (data: {
  email: string;
  password: string;
  nama: string;
  nohandphone: string;
}) => {
  const hashedPassword = await hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      nama: data.nama,
      nohandphone: data.nohandphone,
      cart: {
        create: {},
      },
    },
  });

  return { user };
};
