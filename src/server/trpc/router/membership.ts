import { z } from "zod";
import {
	MembershipCreateSchema,
	MembershipUpdateSchema,
} from "../../common/schemas";
import { protectedProcedure, router } from "../trpc";

export const membershipRouter = router({
	getCurrent: protectedProcedure.query(({ ctx }) =>
		ctx.prisma.membership.findUnique({
			where: { userId: ctx.session.user.id },
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
								user: true,
							},
						},
					},
				},
			},
		})
	),
	create: protectedProcedure
		.input(MembershipCreateSchema)
		.mutation(({ ctx, input }) => {
			console.log({ ...input, userId: ctx.session.user.id });
			return ctx.prisma.membership.create({
				data: { ...input, userId: ctx.session.user.id },
			});
		}),
	byUserId: protectedProcedure
		.input(z.object({ userId: z.string() }))
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
				data: { ...input, userId: ctx.session.user.id },
			})
		),
	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(({ ctx, input }) =>
			ctx.prisma.membership.delete({ where: input })
		),
});
