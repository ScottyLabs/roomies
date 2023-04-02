import { InvitationStatus } from "@prisma/client";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { InvitationCreateSchema } from "../server/common/schemas";
import { useZodForm } from "../utils";
import type { RouterOutputs } from "../utils/trpc";
import { trpc } from "../utils/trpc";
import { DashboardCard } from "./MainLayout";

type InvitationCardProps = {
	profile: NonNullable<RouterOutputs["profile"]["byId"]>;
};

export default function InvitationCard({ profile }: InvitationCardProps) {
	const methods = useZodForm({
		schema: InvitationCreateSchema.omit({
			status: true,
			groupId: true,
			receiverId: true,
		}),
	});

	const { data: theirMembership, status: theirMembershipStatus } =
		trpc.membership.byUserId.useQuery({
			userId: profile.userId,
		});

	const { data: membership, status: membershipStatus } =
		trpc.membership.getCurrent.useQuery();

	const { data: outgoingInvitations, status: invitationStatus } =
		trpc.invitations.getOutgoing.useQuery();

	const context = trpc.useContext();

	const createInvitation = trpc.invitations.create.useMutation({
		onSuccess: async () => {
			await context.invitations.invalidate();
			toast.success("Invitation sent");
		},
		onError: () => {
			toast.error("Failed to send invitation");
		},
	});

	const cancelInvitation = trpc.invitations.delete.useMutation({
		onSuccess: async () => {
			await context.invitations.invalidate();
			toast.success("Invitation canceled");
		},
		onError: () => {
			toast.error("Failed to cancel invitation");
		},
	});

	if (
		invitationStatus === "loading" ||
		membershipStatus === "loading" ||
		theirMembershipStatus === "loading"
	)
		return <div>Loading...</div>;
	if (
		invitationStatus === "error" ||
		membershipStatus === "error" ||
		theirMembershipStatus === "error"
	)
		return <div>Error</div>;

	if (!membership)
		return (
			<div>
				Join or{" "}
				<Link className="link" href="/manage">
					create
				</Link>{" "}
				a group to invite others.
			</div>
		);
	if (theirMembership) return <div>User is already in group.</div>;

	return (
		<DashboardCard>
			{outgoingInvitations.some(
				(invitation) =>
					invitation.receiverId === profile.userId &&
					invitation.status === InvitationStatus.PENDING
			) ? (
				<div className="flex items-center justify-between gap-4">
					<span className="text-sm font-bold opacity-50">
						Invitation pending.
					</span>
					<button
						type="button"
						onClick={() =>
							cancelInvitation.mutate({
								id: outgoingInvitations.find(
									(invitation) => invitation.receiverId === profile.userId
								)!.id,
							})
						}
						className="btn-error btn-sm btn"
					>
						Cancel Invitation
					</button>
				</div>
			) : (
				<>
					<div className="text-xl font-bold">Invite to your group</div>
					<form
						onSubmit={methods.handleSubmit((data) => {
							createInvitation.mutate({
								...data,
								status: InvitationStatus.PENDING,
								receiverId: profile.userId,
								groupId: membership.groupId,
							});
						})}
					>
						<div>
							<label className="label">
								<span className="label-text">
									Send an optional message to {profile.user.name}
								</span>
							</label>
							<textarea
								className="textarea-bordered textarea h-24 w-full"
								placeholder="Hi, would you like to join my group?"
								{...methods.register("message")}
							/>
							<span className="text-xs text-error">
								{methods.formState.errors.message?.message}
							</span>
						</div>
						<div className="form-control">
							<button type="submit" className="btn-primary btn mt-2">
								Send
							</button>
						</div>
					</form>
				</>
			)}
		</DashboardCard>
	);
}
