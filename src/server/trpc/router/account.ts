import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const accountRouter = router({
	getAll: protectedProcedure.query(({ ctx }) =>
		ctx.prisma.account.findMany({ where: { userId: ctx.session.user.id } })
	),
	byProvider: protectedProcedure.input(z.string()).query(({ ctx, input }) =>
		ctx.prisma.account.findFirst({
			where: {
				userId: ctx.session.user.id,
				provider: input,
			},
		})
	),
	remove: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(({ ctx, input }) => ctx.prisma.account.delete({ where: input })),
});
