import type { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState, type ReactElement } from "react";
import { FaGraduationCap, FaSignature } from "react-icons/fa";
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

	if (profileStatus === "loading") return <div>Loading...</div>;
	if (profileStatus === "error") return <div>Error</div>;
	if (!profile) return <div>Profile not found</div>;

	return (
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
					</div>
					<div className="stat">
						<div className="stat-figure text-secondary">
							<FaSignature className="h-10 w-10" />
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
						<div className="stat-desc text-primary">
							{incompatibilities.length} reported
						</div>
					</div>
				</div>
			</DashboardCard>
			<DashboardCard>
				<div className="text-2xl font-bold">Profile</div>
				<div className="w-full overflow-x-auto">
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
