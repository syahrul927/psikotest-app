import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { getServerSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { env } from "~/env";
import { db } from "~/server/db";
import { LoginSchema } from "~/types/types";

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
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
				if (!user) return null;
				return {
					id: user.id,
					email: user.email,
					name: user.name,
					image: user.image,
					role: user.role,
				};
			},
		}),
		GoogleProvider({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		}),
		/**
		 * ...add more providers here.
		 *
		 * Most other providers require a bit more work than the Discord provider. For example, the
		 * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
		 * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
		 *
		 * @see https://next-auth.js.org/providers/github
		 */
	],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
