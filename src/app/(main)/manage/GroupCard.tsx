import { Role } from "@prisma/client";
import { DashboardCard } from "components/DashboardCard";
import Link from "next/link";
import toast from "react-hot-toast";
import { api, type RouterOutputs } from "utils/trpc";

type GroupCardProps = {
	membership: NonNullable<RouterOutputs["memberships"]["getCurrent"]>;
};

export const GroupCard = ({ membership }: GroupCardProps) => {
	const utils = api.useUtils();
	const removeMember = api.memberships.delete.useMutation({
		onSuccess: async () => {
			await utils.memberships.invalidate();
			toast.success("Member removed");
		},
		onError: () => {
			toast.error("Failed to remove member");
		},
	});

	return (
		<DashboardCard>
			<div>
				<h3 className="font-bold">Group Members</h3>
				<span className="text-sm font-thin">
					These are the users that are currently in your group.
				</span>
			</div>
			<div>
				{membership.group.members.map((member) => (
					<div
						key={member.id}
						className="m-2 flex items-center justify-between rounded-md bg-base-200 p-4"
					>
						<div className="flex w-full items-center justify-between">
							<div className="text-lg">
								<Link
									className="link link-secondary text-xl font-bold"
									href={`/users/${member.accountId}`}
								>
									{member.account.id}
								</Link>{" "}
								- <span className="font-mono">{member.role}</span>
							</div>
							<div>
								<button
									type="button"
									onClick={() =>
										removeMember.mutate({
											id: member.id,
										})
									}
									disabled={
										member.role === Role.ADMIN ||
										member.accountId === membership.accountId
									}
									className="btn btn-error btn-sm"
								>
									Remove
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</DashboardCard>
	);
};
