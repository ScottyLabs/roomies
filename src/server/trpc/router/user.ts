import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const userRouter = router({
	getAll: publicProcedure.query(({ ctx }) => ctx.prisma.user.findMany()),
	byId: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(({ ctx, input }) => ctx.prisma.user.findUnique({ where: input })),
});
