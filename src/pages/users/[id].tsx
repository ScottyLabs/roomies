import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ProviderIcons } from "../../components/connections/ConnectionItem";
import MainLayout, { DashboardCard } from "../../components/MainLayout";
import { trpc } from "../../utils/trpc";

const UserPage = () => {
	const router = useRouter();
	const { id } = router.query;

	const { data: user, status: userStatus } = trpc.user.byId.useQuery(
		{ id: id as string },
		{ enabled: typeof id === "string" }
	);

	const { data: connections, status: connectionsStatus } =
		trpc.connections.byUserId.useQuery(
			{ userId: id as string },
			{ enabled: typeof id === "string" }
		);

	if (userStatus === "loading" || connectionsStatus === "loading")
		return <div>Loading...</div>;
	if (userStatus === "error" || connectionsStatus === "error")
		return <div>Error</div>;
	if (!user || !connections) return <div>User not found</div>;

	return (
		<MainLayout>
			<DashboardCard>
				<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
					<div className="flex items-center justify-between gap-4">
						<div className="avatar">
							<div className="mask mask-squircle w-24">
								<Image src={user.image ?? ""} alt="" width={128} height={128} />
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold">{user.name}</div>
							<div className="opacity-50">{user.email}</div>
						</div>
					</div>
					<div className="w-full sm:w-auto">
						{user.profile ? (
							<Link
								href={`/profiles/${user.profile.id}`}
								className="btn-primary btn-sm btn w-full"
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
			<div className="divider w-full max-w-3xl" />
			<div className="w-full max-w-3xl">
				<div className="flex flex-wrap gap-2">
					{connections.map((connection) => (
						<div
							className="shadow-3xl flex max-w-sm flex-1 rounded-lg bg-base-300 p-2 outline outline-1 outline-base-200"
							key={connection.id}
						>
							<div className="flex flex-row items-center gap-4">
								<span>{ProviderIcons[connection.provider]}</span>
								<span className="font-bold">{connection.handle}</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</MainLayout>
	);
};

export default UserPage;
