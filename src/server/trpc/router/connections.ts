import { z } from "zod";
import { ConnectionSchema } from "../../common/schemas";
import { protectedProcedure, router } from "../trpc";

export const connectionsRouter = router({
	getAll: protectedProcedure.query(({ ctx }) =>
		ctx.prisma.connection.findMany({
			where: { userId: ctx.session?.user.id },
		})
	),
	byUserId: protectedProcedure
		.input(z.object({ userId: z.string() }))
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
				data: { ...input, userId: ctx.session.user.id },
			})
		),
});
