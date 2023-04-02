import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaGraduationCap, FaSignature } from "react-icons/fa";
import InvitationCard from "../../components/InvitationCard";
import MainLayout, { DashboardCard } from "../../components/MainLayout";
import type { Incompatibility } from "../../utils/compatibility";
import compatibility from "../../utils/compatibility";
import { trpc } from "../../utils/trpc";

const ProfilePage = () => {
	const router = useRouter();
	const { id } = router.query;

	const { data: profile, status: profileStatus } = trpc.profile.byId.useQuery(
		{ id: id as string },
		{ enabled: typeof id === "string" }
	);

	const { data: currentProfile, status: currentProfileStatus } =
		trpc.profile.getCurrent.useQuery();

	const [incompatibilities, setIncompatibilities] = useState<Incompatibility[]>(
		[]
	);

	useEffect(() => {
		if (profile && currentProfile) {
			setIncompatibilities(compatibility(profile, currentProfile));
		}
	}, [profile, currentProfile]);

	if (profileStatus === "loading" || currentProfileStatus === "loading")
		return <div>Loading...</div>;
	if (profileStatus === "error" || currentProfileStatus === "error")
		return <div>Error</div>;
	if (!profile || !currentProfile) return <div>Profile not found</div>;

	console.log(incompatibilities);

	return (
		<MainLayout>
			<div className="flex w-full flex-col gap-2">
				<DashboardCard>
					<div className="flex flex-col items-center justify-center gap-4">
						<div className="avatar">
							<div className="mask mask-circle w-36">
								<Image
									src={profile.user.image ?? ""}
									alt=""
									width={128}
									height={128}
								/>
							</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold">
								{profile.user.name}{" "}
								<span>{profile.pronouns && `(${profile.pronouns})`}</span>
							</div>
							<div className="opacity-50">{profile.user.email}</div>
						</div>
					</div>
					<div className="stats stats-vertical shadow">
						<div className="stat">
							<div className="stat-figure text-primary">
								<FaGraduationCap className="h-10 w-10" />
							</div>
							<div className="stat-title">Graduation Year</div>
							<div className="stat-value text-primary">{profile.year}</div>
							<div className="stat-desc">21% more than last month</div>
						</div>

						<div className="stat">
							<div className="stat-figure text-secondary">
								<FaSignature className="h-10 w-10" />
							</div>
							<div className="stat-title">Committed</div>
							<div className="stat-value text-secondary">
								{profile.committed.toString()}
							</div>
							<div className="stat-desc">21% more than last month</div>
						</div>

						<div className="stat">
							<div className="stat-figure text-secondary">
								<div className="online avatar">
									<div className="w-16 rounded-full">
										<Image
											src={currentProfile.user.image ?? ""}
											alt=""
											width={64}
											height={64}
										/>
									</div>
								</div>
							</div>
							<div className="stat-value">{incompatibilities.length}</div>
							<div className="stat-title">Compatibility Measure</div>
							<div className="stat-desc text-primary">
								{incompatibilities.length} reported
							</div>
						</div>
					</div>
				</DashboardCard>
				<DashboardCard>
					<div className="text-2xl font-bold">Profile</div>
					<div>
						<table className="table-zebra table w-full">
							<thead>
								{Object.keys(profile)
									.filter((key) => !["user", "id", "userId"].includes(key))
									.map((key) => (
										<tr key={key}>
											<th>{key}</th>
											<td>
												{JSON.stringify(profile[key as keyof typeof profile])}
											</td>
										</tr>
									))}
							</thead>
						</table>
					</div>
				</DashboardCard>
				<InvitationCard profile={profile} />
			</div>
		</MainLayout>
	);
};

export default ProfilePage;
