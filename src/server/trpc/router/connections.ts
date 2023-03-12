import { z } from "zod";
import { ConnectionCreateSchema } from "../../common/schemas";
import { protectedProcedure, router } from "../trpc";

export const connectionsRouter = router({
	getAll: protectedProcedure.query(({ ctx }) =>
		ctx.prisma.connection.findMany({
			where: { userId: ctx.session?.user.id },
		})
	),
	remove: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(({ ctx, input }) =>
			ctx.prisma.connection.delete({ where: input })
		),
	create: protectedProcedure
		.input(ConnectionCreateSchema)
		.mutation(({ ctx, input }) =>
			ctx.prisma.connection.create({
				data: { ...input, userId: ctx.session.user.id },
			})
		),
});
