import type { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState, type ReactElement } from "react";
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
import { Dialog } from "../../components/Dialog";
import InvitationCard from "../../components/InvitationCard";
import MainLayout, { DashboardCard } from "../../components/MainLayout";
import { prisma } from "../../server/db/client";
import type { Incompatibility } from "../../utils/compatibility";
import compatibility from "../../utils/compatibility";
import type { RouterOutputs } from "../../utils/trpc";
import { trpc } from "../../utils/trpc";
import { authOptions } from "../api/auth/[...nextauth]";
import { type NextPageWithLayout } from "../_app";

type ProfileProps = {
	currentProfile: NonNullable<RouterOutputs["profile"]["getCurrent"]>;
};

const Profile: NextPageWithLayout<ProfileProps> = ({ currentProfile }) => {
	const router = useRouter();
	const { id } = router.query;

	const { data: profile, status: profileStatus } = trpc.profile.byId.useQuery(
		{ id: id as string },
		{ enabled: typeof id === "string" }
	);

	const [incompatibilities, setIncompatibilities] = useState<Incompatibility[]>(
		[]
	);

	useEffect(() => {
		if (profile && currentProfile) {
			setIncompatibilities(compatibility(profile, currentProfile));
		}
	}, [profile, currentProfile]);

	const [open, setOpen] = useState(false);

	if (profileStatus === "loading") return <div>Loading...</div>;
	if (profileStatus === "error") return <div>Error</div>;
	if (!profile) return <div>Profile not found</div>;

	return (
		<>
			<Dialog isOpen={open} onClose={() => setOpen(false)}>
				<div className="text-2xl font-medium leading-6">Incompatibilities</div>
				<div>
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
								<span className="badge-primary badge indicator-item">
									{profile.status}
								</span>
								<div className="mask mask-circle w-36">
									<Image
										src={profile.user.image ?? ""}
										alt=""
										width={128}
										height={128}
									/>
								</div>
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
										<span className="badge-secondary badge indicator-item">
											Beta
										</span>
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
				<InvitationCard profile={profile} />
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
};

Profile.getLayout = function getLayout(page: ReactElement) {
	return <MainLayout>{page}</MainLayout>;
};

export default Profile;

export const getServerSideProps: GetServerSideProps<ProfileProps> = async (
	ctx
) => {
	const session = await unstable_getServerSession(
		ctx.req,
		ctx.res,
		authOptions
	);

	const profile = await prisma.profile.findUnique({
		where: { userId: session?.user.id },
		include: { user: true },
	});

	if (!profile)
		return {
			redirect: {
				destination: "/setup/1",
				permanent: true,
			},
		};

	return {
		props: {
			currentProfile: profile,
		},
	};
};
