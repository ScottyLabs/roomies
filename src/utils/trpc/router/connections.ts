import { ConnectionSchema } from "utils/common/schemas";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const connectionsRouter = router({
	getAll: protectedProcedure.query(({ ctx }) =>
		ctx.prisma.connection.findMany({
			where: { accountId: ctx.session.userId },
		})
	),
	byAccountId: protectedProcedure
		.input(z.object({ accountId: z.string() }))
		.query(({ ctx, input }) =>
			ctx.prisma.connection.findMany({
				where: input,
			})
		),
	remove: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(({ ctx, input }) =>
			ctx.prisma.connection.delete({ where: input })
		),
	create: protectedProcedure
		.input(ConnectionSchema)
		.mutation(({ ctx, input }) =>
			ctx.prisma.connection.create({
				data: { ...input, accountId: ctx.session.userId },
			})
		),
});
