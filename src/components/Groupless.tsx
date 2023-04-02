import { InvitationStatus, Role } from "@prisma/client";
import Link from "next/link";
import { toast } from "react-hot-toast";
import MainLayout, { DashboardCard } from "../components/MainLayout";
import { trpc } from "../utils/trpc";

export default function Groupless() {
	const { data: incomingInvitations, status } =
		trpc.invitations.getIncoming.useQuery();

	const context = trpc.useContext();

	const createMembership = trpc.membership.create.useMutation({
		onSuccess: async () => {
			await context.membership.invalidate();
			toast.success("Membership created");
		},
		onError: () => {
			toast.error("Failed to create membership");
		},
	});

	const updateInvitation = trpc.invitations.update.useMutation({
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

			await context.invitations.invalidate();
		},
	});

	const createGroup = trpc.groups.create.useMutation({
		onSuccess: async (data) => {
			toast.success("Group created");
			createMembership.mutate({
				groupId: data.id,
				role: Role.ADMIN,
			});
		},
		onError: () => {
			toast.error("Failed to create group");
		},
	});

	if (status === "loading") return <div>Loading...</div>;
	if (status === "error") return <div>Error</div>;

	return (
		<MainLayout>
			<div className="w-full text-3xl font-bold">Accept An Invitation</div>
			<DashboardCard>
				<div>
					<h3 className="font-bold">Invitations</h3>
					<span className="text-sm font-thin">
						You have{" "}
						<span className="font-mono">{incomingInvitations.length}</span>{" "}
						pending invitations.
					</span>
					{incomingInvitations.map((invitation) => (
						<div
							key={invitation.id}
							className="m-2 flex items-center justify-between rounded-md bg-base-200 p-4"
						>
							<div>
								<div className="text-lg">
									<Link
										className="link-secondary link text-xl font-bold"
										href={`/users/${invitation.receiverId}`}
									>
										{invitation.senderId}
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
									className="btn-error btn-sm btn"
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
									className="btn-success btn-sm btn"
								>
									Accept
								</button>
							</div>
						</div>
					))}
				</div>
			</DashboardCard>
			<div className="divider w-full">OR</div>
			<DashboardCard>
				<button
					type="button"
					onClick={() => createGroup.mutate()}
					className="btn-primary btn w-full"
				>
					Create a new group
				</button>
			</DashboardCard>
		</MainLayout>
	);
}
