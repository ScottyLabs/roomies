"use client";

import { DashboardCard } from "components/DashboardCard";
import { Dialog } from "components/Dialog";
import InvitationCard from "components/InvitationCard";
import { useState } from "react";
import {
	FaBath,
	FaBed,
	FaCheckCircle,
	FaClock,
	FaGraduationCap,
	FaPersonBooth,
	FaSchool,
	FaVolumeUp,
} from "react-icons/fa";
import { api } from "utils/trpc";

export default function Page({ params }: { params: { id: string } }) {
	const [[current, { profile, user }, incompatibilities]] =
		api.useSuspenseQueries((t) => [
			t.users.me(),
			t.profiles.byId({ id: params.id }),
			t.profiles.compatibility({ id: params.id }),
		]);

	const [open, setOpen] = useState(false);

	return (
		<>
			<Dialog isOpen={open} onClose={() => setOpen(false)}>
				<div className="text-2xl font-medium leading-6">Incompatibilities</div>
				<div className="mt-2">
					{incompatibilities.map((incompatibility) => (
						<div className="text-red-500" key={incompatibility.message}>
							{incompatibility.message}
						</div>
					))}
				</div>
			</Dialog>

			<div className="flex w-full flex-col gap-2">
				<DashboardCard>
					<div className="flex flex-col items-center justify-center gap-4">
						<div className="indicator">
							<div className="avatar">
								<span className="badge indicator-item badge-primary">
									{profile.status}
								</span>
								<div className="mask mask-circle w-36">
									<img
										src={user.imageUrl ?? ""}
										alt=""
										width={128}
										height={128}
									/>
								</div>
							</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold">
								{user.username}{" "}
								<span>{profile.pronouns && `(${profile.pronouns})`}</span>
							</div>
							<div className="opacity-50">
								{user.emailAddresses[0]?.emailAddress ?? "No Email"}
							</div>
						</div>
					</div>
					<div className="stats stats-vertical shadow">
						<div className="stat">
							<div className="stat-figure text-primary">
								<FaGraduationCap className="h-10 w-10" />
							</div>
							<div className="stat-title">Graduation Year</div>
							<div className="stat-value text-primary">{profile.year}</div>
						</div>
						<div className="stat">
							<div className="stat-figure text-secondary">
								<FaCheckCircle className="h-10 w-10" />
							</div>
							<div className="stat-title">Committed</div>
							<div className="stat-value text-secondary">
								{profile.committed.toString()}
							</div>
						</div>
						<div className="stat">
							<div className="stat-figure text-secondary">
								<div className="indicator">
									<div className="avatar">
										<span className="badge indicator-item badge-secondary">
											Beta
										</span>
										<div className="w-16 rounded-full">
											<img
												src={current.imageUrl ?? ""}
												alt=""
												width={64}
												height={64}
											/>
										</div>
									</div>
								</div>
							</div>
							<div className="stat-value">{incompatibilities.length}</div>
							<div className="stat-title">Compatibility Measure</div>
							<span className="stat-desc text-primary">
								<button className="link" onClick={() => setOpen(true)}>
									See Detailed Report
								</button>
							</span>
						</div>
					</div>
				</DashboardCard>
				<InvitationCard profile={{ profile, user }} />
				<DashboardCard>
					<div className="flex flex-wrap gap-4">
						<div className="flex flex-1 flex-col items-center rounded-lg bg-base-100 p-4">
							<FaSchool className="h-5 w-5" />
							<span className="text-lg font-bold">{profile.school}</span>
						</div>
						<div className="flex flex-1 flex-col items-center rounded-lg bg-base-100 p-4">
							<FaPersonBooth className="h-5 w-5" />
							<span className="text-lg font-bold">{profile.assigned_sex}</span>
						</div>
						<div className="flex flex-1 flex-col items-center rounded-lg bg-base-100 p-4">
							<FaBath className="h-5 w-5" />
							<span className="text-lg font-bold">
								{profile.bathroom_preference.length > 1 ? (
									profile.bathroom_preference[0]
								) : (
									<>Any</>
								)}
							</span>
						</div>
						{profile.quiet_dorm && (
							<div className="flex flex-1 flex-col items-center rounded-lg bg-base-100 p-4">
								<FaBed className="h-5 w-5" />
								<span className="text-lg font-bold">Quiet Dorm</span>
							</div>
						)}
						<div className="flex flex-1 flex-col items-center rounded-lg bg-base-100 p-4">
							<FaClock className="h-5 w-5" />
							<span className="text-lg font-bold">
								{profile.time_to_ready} minutes
							</span>
						</div>
						<div className="flex flex-1 flex-col items-center rounded-lg bg-base-100 p-4">
							<FaVolumeUp className="h-5 w-5" />
							<span className="text-lg font-bold">{profile.day_volume}</span>
						</div>
					</div>
				</DashboardCard>
			</div>
		</>
	);
}
