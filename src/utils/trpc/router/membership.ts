import { MembershipSchema, MembershipUpdateSchema } from "utils/common/schemas";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const membershipRouter = router({
	getCurrent: protectedProcedure.query(({ ctx }) =>
		ctx.prisma.membership.findUnique({
			where: { accountId: ctx.account.id },
			include: {
				group: {
					include: {
						invitations: {
							include: {
								receiver: true,
								sender: true,
							},
						},
						members: {
							include: {
								account: true,
							},
						},
					},
				},
			},
		})
	),
	create: protectedProcedure
		.input(MembershipSchema)
		.mutation(({ ctx, input }) => {
			return ctx.prisma.membership.create({
				data: { ...input, accountId: ctx.session.userId },
			});
		}),
	byAccountId: protectedProcedure
		.input(z.object({ accountId: z.string() }))
		.query(({ ctx, input }) =>
			ctx.prisma.membership.findUnique({
				where: input,
			})
		),
	update: protectedProcedure
		.input(MembershipUpdateSchema)
		.mutation(({ ctx, input }) =>
			ctx.prisma.membership.update({
				where: { id: input.id },
				data: { ...input, accountId: ctx.session.userId },
			})
		),
	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(({ ctx, input }) =>
			ctx.prisma.membership.delete({ where: input })
		),
});
