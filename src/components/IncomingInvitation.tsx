import { InvitationStatus, Role, type Invitation } from "@prisma/client";
import Link from "next/link";
import toast from "react-hot-toast";
import { api } from "utils/trpc";

export default function IncomingInvitation({
	invitation,
}: {
	invitation: Invitation;
}) {
	const utils = api.useUtils();

	const createMembership = api.memberships.create.useMutation({
		onSuccess: async () => {
			await utils.memberships.invalidate();
			toast.success("Membership created");
		},
		onError: () => {
			toast.error("Failed to create membership");
		},
	});

	const updateInvitation = api.invitations.update.useMutation({
		onSuccess: async (data) => {
			if (data.status === InvitationStatus.ACCEPTED) {
				toast.success("Invitation accepted");
				createMembership.mutate({
					groupId: data.groupId,
					role: Role.MEMBER,
				});
			} else {
				toast.success("Invitation rejected");
			}

			await utils.invitations.invalidate();
		},
	});

	const [sender] = api.users.byId.useSuspenseQuery({
		id: invitation.senderId,
	});

	return (
		<div
			key={invitation.id}
			className="m-2 flex items-center justify-between rounded-md bg-base-200 p-4"
		>
			<div>
				<div className="text-lg">
					<Link
						className="link link-secondary text-xl font-bold"
						href={`/users/${invitation.receiverId}`}
					>
						{sender.username}
					</Link>{" "}
					- <span className="font-mono">{invitation.status}</span>
				</div>
				<span className="text-sm opacity-70">{invitation.message}</span>
			</div>
			<div className="flex gap-2">
				<button
					type="button"
					onClick={() =>
						updateInvitation.mutate({
							id: invitation.id,
							status: InvitationStatus.DECLINED,
						})
					}
					disabled={invitation.status !== InvitationStatus.PENDING}
					className="btn btn-error btn-sm"
				>
					Decline
				</button>
				<button
					type="button"
					onClick={() =>
						updateInvitation.mutate({
							id: invitation.id,
							status: InvitationStatus.ACCEPTED,
						})
					}
					disabled={invitation.status !== InvitationStatus.PENDING}
					className="btn btn-success btn-sm"
				>
					Accept
				</button>
			</div>
		</div>
	);
}
