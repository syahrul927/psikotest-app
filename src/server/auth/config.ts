import { PrismaAdapter } from "@auth/prisma-adapter";
import { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { env } from "@/env";
import { db } from "@/server/db";
import { z } from "zod";
import { comparePassword } from "@/lib/password-utils";

export const LoginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */

export const authConfig = {
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.user = user;
      }
      return token;
    },
    session: ({ session, token }) => {
      const response = {
        ...session,
        user: {
          ...token.user,
        },
      };
      return response;
    },
  },
  secret: env.NEXTAUTH_SECRET ?? "",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 30 * 60,
  },
  pages: {
    signIn: "/authentication",
  },
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      type: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "username",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const creds = await LoginSchema.parseAsync(credentials);
        const user = await db.user.findFirst({
          where: {
            email: creds.email,
          },
        });
        if (!user?.password) return null;
        const isPasswordValid = await comparePassword(
          creds.password,
          user.password,
        );

        if (!isPasswordValid) {
          return null;
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
