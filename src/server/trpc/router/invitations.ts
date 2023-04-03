import { z } from "zod";
import { InvitationSchema, InvitationUpdateSchema } from "../../common/schemas";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const invitationRouter = router({
	getAll: publicProcedure.query(({ ctx }) =>
		ctx.prisma.invitation.findMany({
			include: { receiver: true, sender: true },
		})
	),
	getIncoming: protectedProcedure.query(({ ctx }) =>
		ctx.prisma.invitation.findMany({
			where: { receiverId: ctx.session.user.id },
			include: { receiver: true, sender: true },
		})
	),
	getOutgoing: protectedProcedure.query(({ ctx }) =>
		ctx.prisma.invitation.findMany({
			where: { senderId: ctx.session.user.id },
			include: { receiver: true, sender: true },
		})
	),
	byId: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(({ ctx, input }) =>
			ctx.prisma.invitation.findUnique({
				where: input,
				include: { receiver: true, sender: true },
			})
		),
	create: protectedProcedure
		.input(InvitationSchema)
		.mutation(({ ctx, input }) =>
			ctx.prisma.invitation.create({
				data: {
					...input,
					senderId: ctx.session.user.id,
				},
			})
		),
	update: publicProcedure
		.input(InvitationUpdateSchema)
		.mutation(({ ctx, input }) =>
			ctx.prisma.invitation.update({ where: { id: input.id }, data: input })
		),
	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(({ ctx, input }) =>
			ctx.prisma.invitation.delete({ where: input })
		),
});
