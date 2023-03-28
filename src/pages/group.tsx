import {
	Group,
	Invitation,
	InvitationStatus,
	Membership,
	Role,
} from "@prisma/client";
import type { NextPage } from "next";
import Link from "next/link";
import { toast } from "react-hot-toast";
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

type GroupCardProps = {
	group: Group & {
		invitations: Invitation[];
		members: Membership[];
	};
	membership: Membership;
};
const GroupCard = ({ group, membership }: GroupCardProps) => {
	const context = trpc.useContext();
	const removeMember = trpc.membership.delete.useMutation({
		onSuccess: async () => {
			await context.membership.invalidate();
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
				{group.members.map((member) => (
					<div
						key={member.id}
						className="m-2 flex items-center justify-between rounded-md bg-base-200 p-4"
					>
						<div className="flex w-full items-center justify-between">
							<div className="text-lg">
								<Link
									className="link-secondary link text-xl font-bold"
									href={`/users/${member.userId}`}
								>
									{member.userId}
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
										member.userId === membership.userId
									}
									className="btn-error btn-sm btn"
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

const Groupless = () => {
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
			<div className="w-full text-3xl font-bold">Find or Create a Group</div>
			<DashboardCard>
				<div>
					<h3 className="font-bold">Invitations</h3>
					<span className="text-sm font-thin">
						These are invitations sent to you by other users.
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
			<div className="w-full">
				<button
					type="button"
					onClick={() => createGroup.mutate()}
					className="btn-primary btn-sm btn"
				>
					Create a new group
				</button>
			</div>
		</MainLayout>
	);
};

type ActionCardProps = {
	membership: Membership & {
		group: Group & {
			members: Membership[];
			invitations: Invitation[];
		};
	};
};
const ActionCard = ({ membership }: ActionCardProps) => {
	const context = trpc.useContext();

	const leaveGroup = trpc.membership.delete.useMutation({
		onSuccess: async () => {
			await context.membership.invalidate();
			toast.success("Membership deleted");
		},
		onError: () => {
			toast.error("Failed to delete membership");
		},
	});

	const deleteGroup = trpc.groups.delete.useMutation({
		onSuccess: async () => {
			await context.membership.invalidate();
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
						These are actions you can take on your group.
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
									className="btn-error btn-sm btn"
									disabled={
										membership.role !== Role.ADMIN ||
										membership.group.members.length > 1
									}
								>
									Delete Group
								</button>
							)}
							<button
								type="button"
								onClick={() => leaveGroup.mutate({ id: membership.id })}
								className="btn-error btn-sm btn"
								disabled={membership.role === Role.ADMIN}
							>
								Leave Group
							</button>
						</div>
					</div>
				</div>
			</DashboardCard>
		</div>
	);
};

const GroupPage: NextPage = () => {
	const { data: membership, status } = trpc.membership.getCurrent.useQuery();

	if (status === "loading") return <div>Loading...</div>;
	if (status === "error") return <div>Error</div>;

	if (!membership) return <Groupless />;

	return (
		<MainLayout>
			<div className="w-full text-3xl font-bold">Your Roommate Group</div>
			<InvitationManager group={membership.group} membership={membership} />
			<GroupCard group={membership.group} membership={membership} />
			<ActionCard membership={membership} />
		</MainLayout>
	);
};

export default GroupPage;
