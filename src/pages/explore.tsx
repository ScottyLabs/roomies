import type { NextPage } from "next";
import Image from "next/image";
import MainLayout, { DashboardCard } from "../components/MainLayout";
import { StatusLabels } from "../types/constants";
import { trpc } from "../utils/trpc";

const Explore: NextPage = () => {
	const { data: profiles } = trpc.profile.getAll.useQuery();

	return (
		<MainLayout>
			<div className="w-full text-3xl font-bold">Explore</div>
			<DashboardCard>
				<table className="table w-full min-w-[1024px] table-fixed">
					<thead>
						<tr>
							<th className="w-72">General Information</th>
							<th>Identity</th>
							<th>Personal Information</th>
							<th>Schools</th>
							<th className="w-32" />
						</tr>
					</thead>
					<tbody>
						{profiles?.map((profile) => (
							<tr key={profile.id}>
								<td>
									<div className="flex items-center space-x-3">
										<div className="indicator">
											<span className="indicator-item flex flex-col gap-1">
												{profile.committed && (
													<span className="badge-secondary badge badge-xs font-bold uppercase tracking-tighter">
														Committed
													</span>
												)}
												<span className="badge-accent badge badge-xs font-bold uppercase tracking-tighter">
													{StatusLabels[profile.status]}
												</span>
											</span>
											<div className="avatar">
												<div className="mask mask-squircle h-20 w-20">
													<Image
														src={profile.user.image ?? ""}
														alt="profile"
														width={64}
														height={64}
													/>
												</div>
											</div>
										</div>
										<div>
											<div className="font-bold">
												{profile.user.name}, {profile.year}
											</div>
											<div className="text-sm opacity-50">
												{profile.user.email}
											</div>
										</div>
									</div>
								</td>
								<td className="whitespace-normal break-words font-thin">
									<div>
										<span>Assigned Sex:</span>{" "}
										<span className="font-bold">{profile.assigned_sex}</span>
									</div>
									<div>
										<span>Sexual Orientation:</span>{" "}
										<span className="font-bold">
											{profile.sexual_orientation}
										</span>
									</div>
									<div>
										<span>Pronouns:</span>{" "}
										<span className="font-bold">{profile.pronouns}</span>
									</div>
								</td>
								<td className="whitespace-normal break-words font-thin">
									<div>
										<span>Location:</span>{" "}
										<span className="font-bold">{profile.location}</span>
									</div>
									<div>
										<span>Health Concerns:</span>{" "}
										<span className="font-bold">
											{profile.health_concerns || "N/A"}
										</span>
									</div>
								</td>
								<td>
									<div className="whitespace-normal break-words font-mono">
										{profile.schools.join(", ")}
									</div>
								</td>
								<th>
									<button disabled className="btn-ghost disabled btn-xs btn">
										details
									</button>
								</th>
							</tr>
						))}
					</tbody>
				</table>
			</DashboardCard>
		</MainLayout>
	);
};

export default Explore;
