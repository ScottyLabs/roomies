import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
	debug: true,
	callbacks: {
		jwt: async ({ token, account, profile }) => {
			if (profile) token.profile = profile;
			if (account?.access_token) token.accessToken = account.access_token;
			return token;
		},
		session: async ({ session, token }) => {
			if (token.sub) session.user.id = token.sub;
			return session;
		},
	},
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		}),
		DiscordProvider({
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET,
		}),
	],
	secret: env.NEXTAUTH_SECRET,
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/auth/signin",
	},
};

export default NextAuth(authOptions);
