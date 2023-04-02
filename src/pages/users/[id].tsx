import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import MainLayout, { DashboardCard } from "../../components/MainLayout";
import { trpc } from "../../utils/trpc";

const UserPage = () => {
	const router = useRouter();
	const { id } = router.query;

	const { data: user, status: userStatus } = trpc.user.byId.useQuery(
		{ id: id as string },
		{ enabled: typeof id === "string" }
	);

	if (userStatus === "loading") return <div>Loading...</div>;
	if (userStatus === "error") return <div>Error</div>;
	if (!user) return <div>User not found</div>;

	return (
		<MainLayout>
			<div className="w-full text-3xl font-bold">{user.name}</div>
			<div className="flex w-full flex-col gap-2">
				<DashboardCard>
					<div className="flex items-center justify-between">
						<div className="flex flex-row items-center gap-4">
							<div className="avatar">
								<div className="mask mask-squircle w-24">
									<Image
										src={user.image ?? ""}
										alt=""
										width={128}
										height={128}
									/>
								</div>
							</div>
							<div>
								<div className="text-2xl font-bold">{user.name}</div>
								<div className="leading-4 opacity-50">{user.email}</div>
							</div>
						</div>
						<div>
							{user.profile ? (
								<Link
									href={`/profiles/${user.profile.id}`}
									className="btn-primary btn-sm btn"
								>
									View Profile
								</Link>
							) : (
								<span>
									<span className="text-red-500">No profile found</span>
								</span>
							)}
						</div>
					</div>
				</DashboardCard>
			</div>
		</MainLayout>
	);
};

export default UserPage;
