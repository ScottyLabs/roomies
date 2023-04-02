import { z } from "zod";
import { ProfileCreateSchema, ProfileUpdateSchema } from "../../common/schemas";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const profileRouter = router({
	getAll: publicProcedure.query(({ ctx }) =>
		ctx.prisma.profile.findMany({ include: { user: true } })
	),
	byId: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(({ ctx, input }) =>
			ctx.prisma.profile.findUnique({
				where: input,
				include: { user: true },
			})
		),
	byUserId: publicProcedure
		.input(z.object({ userId: z.string() }))
		.query(({ ctx, input }) =>
			ctx.prisma.profile.findUnique({
				where: input,
				include: { user: true },
			})
		),
	getCurrent: protectedProcedure.query(({ ctx }) =>
		ctx.prisma.profile.findUnique({
			where: { userId: ctx.session.user.id },
		})
	),
	create: protectedProcedure
		.input(ProfileCreateSchema)
		.mutation(({ ctx, input }) =>
			ctx.prisma.profile.create({
				data: { ...input, userId: ctx.session.user.id },
			})
		),
	update: publicProcedure
		.input(ProfileUpdateSchema)
		.mutation(({ ctx, input }) =>
			ctx.prisma.profile.update({ where: { id: input.id }, data: input })
		),
});
