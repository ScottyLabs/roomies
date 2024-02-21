import type { Profile } from "@prisma/client";

export enum Severity {
	LOW,
	MEDIUM,
	HIGH,
}

export interface Incompatibility {
	severity: Severity;
	message: string;
}

export default function compatibility(profile1: Profile, profile2: Profile) {
	const incompatibilities: Incompatibility[] = [];

	if (profile1.year !== profile2.year)
		incompatibilities.push({
			severity: Severity.HIGH,
			message: "Year of study is different",
		});
	if (profile1.alcohol !== profile2.alcohol)
		incompatibilities.push({
			severity: Severity.HIGH,
			message: "Alcohol consumption is different",
		});
	if (profile1.drugs !== profile2.drugs)
		incompatibilities.push({
			severity: Severity.HIGH,
			message: "Drug consumption is different",
		});
	if (Math.abs(profile1.neatness - profile2.neatness) > 25)
		incompatibilities.push({
			severity: Severity.MEDIUM,
			message: "Neatness differs by 25%",
		});
	if (
		Math.abs(profile1.social_energy_level - profile2.social_energy_level) > 25
	)
		incompatibilities.push({
			severity: Severity.MEDIUM,
			message: "Social energy level differs by 25%",
		});
	if (profile1.day_volume !== profile2.day_volume)
		incompatibilities.push({
			severity: Severity.MEDIUM,
			message: "Day volume is different",
		});
	if (profile1.night_volume !== profile2.night_volume)
		incompatibilities.push({
			severity: Severity.MEDIUM,
			message: "Night volume is different",
		});

	return incompatibilities;
}
