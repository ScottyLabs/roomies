import { clerkClient } from "@clerk/nextjs";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const userRouter = router({
	byId: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ input }) => clerkClient.users.getUser(input.id)),
	many: publicProcedure.query(() => {
		return clerkClient.users.getUserList();
	}),
	me: protectedProcedure.query(async ({ ctx }) => {
		return clerkClient.users.getUser(ctx.session.userId);
	}),
});
