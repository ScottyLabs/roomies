import { ProviderIcons } from "components/connections/ConnectionItem";
import { DashboardCard } from "components/DashboardCard";
import Image from "next/image";
import Link from "next/link";
import { api } from "utils/trpc";

export default function User({ params }: { params: { id: string } }) {
	const [[user, connections, profile]] = api.useSuspenseQueries((t) => [
		t.users.byId({ id: params.id }),
		t.connections.byAccountId({ accountId: params.id }),
		t.profiles.byUserId({ accountId: params.id }),
	]);

	if (!user || !connections) return <div>User not found</div>;

	return (
		<>
			<DashboardCard>
				<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
					<div className="flex items-center justify-between gap-4">
						<div className="avatar">
							<div className="mask mask-squircle w-24">
								<Image
									src={user.imageUrl ?? ""}
									alt=""
									width={128}
									height={128}
								/>
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold">{user.username}</div>
							<div className="opacity-50">
								{user.emailAddresses[0]?.emailAddress ?? "No Email"}
							</div>
						</div>
					</div>
					<div className="w-full sm:w-auto">
						{profile ? (
							<Link
								href={`/profiles/${profile.id}`}
								className="btn btn-primary btn-sm w-full"
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
			<div className="w-full">
				<div className="divider w-full max-w-3xl" />
			</div>
			<div className="w-full max-w-3xl">
				<div className="flex flex-wrap gap-2">
					{connections.map((connection) => (
						<div
							className="shadow-3xl outline flex max-w-sm flex-1 rounded-lg bg-base-300 p-2 outline-1 outline-base-200"
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
		</>
	);
}
