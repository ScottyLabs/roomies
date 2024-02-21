import type {
	SignedInAuthObject,
	SignedOutAuthObject,
} from "@clerk/nextjs/server";
import type { Account } from "@prisma/client";

import { prisma } from "utils/db/client";

export const createTRPCContext = async (opts: {
	headers: Headers;
	session: SignedInAuthObject | SignedOutAuthObject;
}) => {
	const session = opts.session;
	const source = opts.headers.get("x-trpc-source") ?? "unknown";

	console.log(">>> tRPC Request from", source, "by", session.userId);

	let account: Account | null = null;

	if (session.userId) {
		account = await prisma.account.findUnique({
			where: {
				id: session.userId,
			},
		});
	}

	return {
		session,
		prisma,
		account,
	};
};

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
