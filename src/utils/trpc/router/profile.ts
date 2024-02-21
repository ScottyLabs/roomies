import { clerkClient } from "@clerk/nextjs";
import compatibility from "lib/compatibility";
import { ProfileSchema, ProfileUpdateSchema } from "utils/common/schemas";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const profileRouter = router({
	getAll: publicProcedure.query(async ({ ctx }) => {
		const profiles = await ctx.prisma.profile.findMany({
			include: { account: true },
		});

		return Promise.all(
			profiles.map(async (profile) => {
				const user = await clerkClient.users.getUser(profile.accountId);
				return { user, profile };
			})
		);
	}),
	byId: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const profile = await ctx.prisma.profile.findUniqueOrThrow({
				where: input,
				include: { account: true },
			});
			const user = await clerkClient.users.getUser(profile.accountId);
			return { user, profile };
		}),
	byUserId: publicProcedure
		.input(z.object({ accountId: z.string() }))
		.query(({ ctx, input }) =>
			ctx.prisma.profile.findUnique({
				where: input,
				include: { account: true },
			})
		),
	getCurrent: protectedProcedure.query(async ({ ctx }) => {
		const profile = await ctx.prisma.profile.findUniqueOrThrow({
			where: { accountId: ctx.session.userId },
			include: { account: true },
		});
		return { profile, user: ctx.session.user };
	}),
	create: protectedProcedure.input(ProfileSchema).mutation(({ ctx, input }) =>
		ctx.prisma.profile.create({
			data: { ...input, accountId: ctx.session.userId },
		})
	),
	update: publicProcedure
		.input(ProfileUpdateSchema)
		.mutation(({ ctx, input }) =>
			ctx.prisma.profile.update({ where: { id: input.id }, data: input })
		),
	compatibility: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const profile = await ctx.prisma.profile.findUnique({
				where: {
					accountId: ctx.account.id,
				},
			});

			if (!profile) {
				throw new Error("Your profile not found");
			}

			const other = await ctx.prisma.profile.findUnique({
				where: { id: input.id },
				include: { account: true },
			});

			if (!other) {
				throw new Error("Their profile not found");
			}

			return compatibility(other, profile);
		}),
});
