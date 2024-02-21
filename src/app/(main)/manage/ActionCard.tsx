import { Role } from "@prisma/client";
import { DashboardCard } from "components/DashboardCard";
import toast from "react-hot-toast";
import { api, type RouterOutputs } from "utils/trpc";

type ActionCardProps = {
	membership: NonNullable<RouterOutputs["memberships"]["getCurrent"]>;
};

export const ActionCard = ({ membership }: ActionCardProps) => {
	const utils = api.useUtils();

	const leaveGroup = api.memberships.delete.useMutation({
		onSuccess: async () => {
			await utils.memberships.invalidate();
			toast.success("Membership deleted");
		},
		onError: () => {
			toast.error("Failed to delete membership");
		},
	});

	const deleteGroup = api.groups.delete.useMutation({
		onSuccess: async () => {
			await utils.memberships.invalidate();
			toast.success("Group deleted");
		},
		onError: () => {
			toast.error("Failed to delete group");
		},
	});

	return (
		<div className="w-full">
			<DashboardCard>
				<div>
					<h3 className="font-bold">Actions</h3>
					<span className="text-sm font-thin">
						These are actions you can take on your group. The group may be
						deleted if you are the only member.
					</span>
					<div className="m-2 flex items-center justify-between rounded-md bg-base-200 p-4">
						<div className="text-lg">
							<span className="font-mono">{membership.role}</span>
						</div>
						<div className="flex gap-2">
							{membership.role === Role.ADMIN && (
								<button
									type="button"
									onClick={() => deleteGroup.mutate({ id: membership.groupId })}
									className="btn btn-error btn-sm"
									disabled={
										membership.role !== Role.ADMIN ||
										membership.group.members.length > 1
									}
								>
									Delete
								</button>
							)}
							<button
								type="button"
								onClick={() => leaveGroup.mutate({ id: membership.id })}
								className="btn btn-error btn-sm"
								disabled={membership.role === Role.ADMIN}
							>
								Leave
							</button>
						</div>
					</div>
				</div>
			</DashboardCard>
		</div>
	);
};
