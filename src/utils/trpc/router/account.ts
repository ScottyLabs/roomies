import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const accountRouter = router({
	getAll: protectedProcedure.query(({ ctx }) =>
		ctx.prisma.account.findMany({ where: { id: ctx.session.userId } })
	),
	byId: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(({ ctx, input }) =>
			ctx.prisma.account.findUniqueOrThrow({ where: input })
		),
	remove: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(({ ctx, input }) => ctx.prisma.account.delete({ where: input })),
	count: publicProcedure.query(({ ctx }) => ctx.prisma.account.count()),
});
