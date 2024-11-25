import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { login } from "@/services/auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        try {
          const { user } = await login(credentials.email, credentials.password);
          return {
            id: user.id,
            email: user.email,
            nama: user.nama, // Include nama property
            profilePicture: user.profilePicture,
            image: user.profilePicture, // Map profilePicture to image
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }

      if (user) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email,
          picture: user.image,
        };
      }
      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          name: token.name,
          email: token.email,
          image: token.picture,
          profilePicture: token.picture,
        },
      };
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
