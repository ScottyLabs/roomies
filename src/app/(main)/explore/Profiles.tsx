import type { ProfileSearchSchema } from "utils/common/schemas";
import { api } from "utils/trpc";
import type { z } from "zod";
import { Profile } from "./Profile";

type ProfilesProps = {
	query: string;
	filter: z.infer<typeof ProfileSearchSchema>;
};

export function Profiles({ query, filter }: ProfilesProps) {
	const [profiles] = api.profiles.getAll.useSuspenseQuery();

	const filteredProfiles = profiles.filter(({ profile, user }) => {
		if (
			typeof filter.alcohol !== "undefined" &&
			!filter.alcohol &&
			profile.alcohol
		)
			return false;
		if (
			!!filter.assigned_sex &&
			!!profile.assigned_sex &&
			filter.assigned_sex !== profile.assigned_sex
		)
			return false;
		if (
			typeof filter.committed !== "undefined" &&
			!filter.committed &&
			profile.committed
		)
			return false;
		if (
			!!filter.day_volume &&
			!!profile.day_volume &&
			filter.day_volume !== profile.day_volume
		)
			return false;
		if (typeof filter.drugs !== "undefined" && !filter.drugs && profile.drugs)
			return false;
		if ((filter.minimum_neatness ?? -10) + 10 > profile.neatness) return false;
		if (
			!!filter.night_volume &&
			!!profile.night_volume &&
			filter.night_volume !== profile.night_volume
		)
			return false;
		if (!!filter.school && !!profile.school && filter.school !== profile.school)
			return false;
		if (typeof filter.snore !== "undefined" && !filter.snore && profile.snore)
			return false;
		if (
			(filter.minimum_social_energy_level ?? -10) + 10 >
			profile.social_energy_level
		)
			return false;
		if (!!filter.status && !!profile.status && filter.status !== profile.status)
			return false;

		return (
			user.username?.toLowerCase().includes(query.toLowerCase()) ||
			user.emailAddresses[0]?.emailAddress
				?.toLowerCase()
				.includes(query.toLowerCase()) ||
			profile.school.toLowerCase().includes(query.toLowerCase())
		);
	});

	return (
		<>
			{filteredProfiles.map(({ profile, user }) => (
				<Profile key={profile.id} profile={profile} user={user} />
			))}
		</>
	);
}
