import type { Group, Invitation, Membership } from "@prisma/client";
import { InvitationStatus, Role } from "@prisma/client";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Groupless from "../components/Groupless";
import MainLayout, { DashboardCard } from "../components/MainLayout";
import { trpc } from "../utils/trpc";

type InvitationManagerProps = {
	group: Group & {
		invitations: Invitation[];
		members: Membership[];
	};
	membership: Membership;
};

const InvitationManager = ({ group, membership }: InvitationManagerProps) => {
	const context = trpc.useContext();

	const cancelInvitation = trpc.invitations.delete.useMutation({
		onSuccess: async () => {
			await context.invitations.invalidate();
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
						These are the invitations your group has sent to other users.
					</span>
					{group.invitations.map((invitation) => (
						<div
							key={invitation.id}
							className="m-2 flex items-center justify-between rounded-md bg-base-200 p-4"
						>
							<div className="text-lg">
								<Link
									className="link-secondary link text-xl font-bold"
									href={`/users/${invitation.receiverId}`}
								>
									{invitation.receiverId}
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
								className="btn-error btn-sm btn"
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

export default function InvitationPage() {
	const { data: membership, status } = trpc.membership.getCurrent.useQuery();

	if (status === "loading") return <div>Loading...</div>;
	if (status === "error") return <div>Error</div>;

	if (!membership) return <Groupless />;

	return (
		<MainLayout>
			<div className="w-full text-3xl font-bold">Your Roommate Group</div>
			<InvitationManager group={membership.group} membership={membership} />
		</MainLayout>
	);
}
