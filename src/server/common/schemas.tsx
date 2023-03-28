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

export const ConnectionCreateSchema = z.object({
	provider: z.nativeEnum(Media),
	handle: z.string(),
});

export const ProfileCreateSchema = z.object({
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
	schools: z.array(z.nativeEnum(School)),
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

export const ProfileUpdateSchema = z.object({
	id: z.string(),
	year: z.coerce
		.number()
		.int()
		.min(new Date().getFullYear())
		.max(new Date().getFullYear() + 4)
		.optional(),
	committed: z.boolean().optional(),
	status: z.nativeEnum(Status).optional(),
	assigned_sex: z.nativeEnum(Sex).optional(),
	sexual_orientation: z.string().optional(),
	pronouns: z.string().optional(),
	location: z.string().optional(),
	health_concerns: z.string().optional(),
	schools: z.array(z.nativeEnum(School)).optional(),
	roommate_preferred_gender: z.string().optional(),
	roommate_preferred_schools: z.array(z.nativeEnum(School)).optional(),
	preferred_dorm: z.array(z.nativeEnum(Dorm)).optional(),
	bathroom_preference: z.array(z.nativeEnum(Bathroom)).optional(),
	quiet_dorm: z.boolean().optional(),
	wake: z
		.string()
		.regex(/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/)
		.optional(),
	time_to_ready: z.coerce
		.number()
		.int()
		.min(0)
		.max(60 * 24)
		.optional(),
	day_volume: z.nativeEnum(Volume).optional(),
	sleep: z
		.string()
		.regex(/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/)
		.optional(),
	sleep_needs: z.string().optional(),
	night_volume: z.nativeEnum(Volume).optional(),
	snore: z.boolean().optional(),
	shower_time: z.nativeEnum(ShowerTime).optional(),
	study_preferences: z.string().optional(),
	neatness: z.coerce.number().int().min(0).max(100).optional(),
	social_energy_level: z.coerce.number().int().min(0).max(100).optional(),
	alcohol: z.boolean().optional(),
	drugs: z.boolean().optional(),
	parties: z.string().optional(),
	political_spectrum: z.string().optional(),
	religion: z.string().optional(),
	music: z.string().optional(),
	aesthetic: z.string().optional(),
	hobbies: z.string().optional(),
	personality_test: z.string().optional(),
	fun_fact: z.string().optional(),
	notes: z.string().optional(),
});

export const InvitationCreateSchema = z.object({
	receiverId: z.string(),
	groupId: z.string(),
	message: z.string().max(100),
	status: z.nativeEnum(InvitationStatus),
});

export const InvitationUpdateSchema = z.object({
	id: z.string(),
	status: z.nativeEnum(InvitationStatus),
});

export const MembershipCreateSchema = z.object({
	groupId: z.string(),
	role: z.nativeEnum(Role),
});

export const MembershipUpdateSchema = z.object({
	id: z.string(),
	role: z.nativeEnum(Role),
});

export const GroupCreateSchema = z.object({});
