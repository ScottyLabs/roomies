import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const groupRouter = router({
	getCurrent: protectedProcedure.query(({ ctx }) =>
		ctx.prisma.group.findFirst({
			where: {
				members: {
					some: {
						id: ctx.session.user.id,
					},
				},
			},
		})
	),
	create: protectedProcedure.mutation(({ ctx }) =>
		ctx.prisma.group.create({ data: {} })
	),
	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(({ ctx, input }) => ctx.prisma.group.delete({ where: input })),
	isInGroup: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(({ ctx, input }) =>
			ctx.prisma.group.findFirst({
				where: {
					members: {
						some: {
							id: input.id,
						},
					},
				},
			})
		),
});
