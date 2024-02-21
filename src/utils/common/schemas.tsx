import {
	Bathroom,
	Dorm,
	InvitationStatus,
	Media,
	Role,
	School,
	Sex,
	ShowerTime,
	Status,
	Volume,
} from "@prisma/client";
import { z } from "zod";

export const ConnectionSchema = z.object({
	provider: z.nativeEnum(Media),
	handle: z.string(),
});

export const ProfileSchema = z.object({
	year: z.coerce
		.number()
		.int()
		.min(new Date().getFullYear())
		.max(new Date().getFullYear() + 4),
	committed: z.boolean(),
	status: z.nativeEnum(Status),
	assigned_sex: z.nativeEnum(Sex),
	sexual_orientation: z.string(),
	pronouns: z.string(),
	location: z.string(),
	health_concerns: z.string(),
	school: z.nativeEnum(School),
	roommate_preferred_gender: z.string(),
	roommate_preferred_schools: z.array(z.nativeEnum(School)),
	preferred_dorm: z.array(z.nativeEnum(Dorm)),
	bathroom_preference: z.array(z.nativeEnum(Bathroom)),
	quiet_dorm: z.boolean(),
	wake: z.string().regex(/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/),
	time_to_ready: z.coerce
		.number()
		.int()
		.min(0)
		.max(60 * 24),
	day_volume: z.nativeEnum(Volume),
	sleep: z.string().regex(/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/),
	sleep_needs: z.string(),
	night_volume: z.nativeEnum(Volume),
	snore: z.boolean(),
	shower_time: z.nativeEnum(ShowerTime),
	study_preferences: z.string(),
	neatness: z.coerce.number().int().min(0).max(100),
	social_energy_level: z.coerce.number().int().min(0).max(100),
	alcohol: z.boolean(),
	drugs: z.boolean(),
	parties: z.string(),
	political_spectrum: z.string(),
	religion: z.string(),
	music: z.string(),
	aesthetic: z.string(),
	hobbies: z.string(),
	personality_test: z.string(),
	fun_fact: z.string(),
	notes: z.string(),
});
export const ProfileUpdateSchema = ProfileSchema.partial().extend({
	id: z.string(),
});
export const ProfileSearchSchema = z
	.object({
		committed: z.boolean().nullable(),
		status: z.nativeEnum(Status).nullable().or(z.literal("")),
		assigned_sex: z.nativeEnum(Sex).nullable().or(z.literal("")),
		school: z.nativeEnum(School).nullable().or(z.literal("")),
		day_volume: z.nativeEnum(Volume).nullable().or(z.literal("")),
		night_volume: z.nativeEnum(Volume).nullable().or(z.literal("")),
		snore: z.boolean().nullable(),
		minimum_neatness: z.coerce.number().int().min(0).max(100).nullable(),
		minimum_social_energy_level: z.coerce
			.number()
			.int()
			.min(0)
			.max(100)
			.nullable(),
		alcohol: z.boolean().nullable(),
		drugs: z.boolean().nullable(),
	})
	.partial();

export const InvitationSchema = z.object({
	receiverId: z.string(),
	groupId: z.string(),
	message: z.string().max(100),
	status: z.nativeEnum(InvitationStatus),
});
export const InvitationUpdateSchema = z.object({
	id: z.string(),
	status: z.nativeEnum(InvitationStatus),
});

export const MembershipSchema = z.object({
	groupId: z.string(),
	role: z.nativeEnum(Role),
});
export const MembershipUpdateSchema = z.object({
	id: z.string(),
	role: z.nativeEnum(Role),
});

export const GroupCreateSchema = z.object({});
