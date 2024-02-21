import { InvitationStatus, Role } from "@prisma/client";
import { DashboardCard } from "components/DashboardCard";
import Link from "next/link";
import toast from "react-hot-toast";
import { api, type RouterOutputs } from "utils/trpc";

type InvitationManagerProps = {
	membership: NonNullable<RouterOutputs["memberships"]["getCurrent"]>;
	receiver: NonNullable<RouterOutputs["users"]["me"]>;
};

export const InvitationManager = ({
	membership,
	receiver,
}: InvitationManagerProps) => {
	const utils = api.useUtils();

	const cancelInvitation = api.invitations.delete.useMutation({
		onSuccess: async () => {
			await utils.invitations.invalidate();
			toast.success("Invitation canceled");
		},
		onError: () => {
			toast.error("Failed to cancel invitation");
		},
	});

	return (
		<div className="flex w-full gap-4">
			<DashboardCard>
				<div>
					<h3 className="font-bold">Invitations</h3>
					<span className="text-sm font-thin">
						There are{" "}
						<span className="font-mono">
							{membership.group.invitations.length}
						</span>{" "}
						outgoing invitations.
					</span>
					{membership.group.invitations.map((invitation) => (
						<div
							key={invitation.id}
							className="m-2 flex items-center justify-between rounded-md bg-base-200 p-4"
						>
							<div className="text-lg">
								<Link
									className="link link-secondary text-xl font-bold"
									href={`/users/${invitation.receiverId}`}
								>
									{receiver.username}
								</Link>{" "}
								- <span className="font-mono">{invitation.status}</span>
							</div>
							<button
								type="button"
								onClick={() => cancelInvitation.mutate({ id: invitation.id })}
								disabled={
									invitation.status !== InvitationStatus.PENDING ||
									membership.role !== Role.ADMIN
								}
								className="btn btn-error btn-sm"
							>
								Cancel
							</button>
						</div>
					))}
				</div>
			</DashboardCard>
		</div>
	);
};
