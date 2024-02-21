import { InvitationStatus } from "@prisma/client";
import { useZodForm } from "lib";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { InvitationSchema } from "utils/common/schemas";
import type { RouterOutputs } from "utils/trpc";
import { api } from "utils/trpc";
import { DashboardCard } from "./DashboardCard";

type InvitationCardProps = {
	profile: NonNullable<RouterOutputs["profiles"]["byId"]>;
};

export default function InvitationCard({ profile }: InvitationCardProps) {
	const methods = useZodForm({
		schema: InvitationSchema.omit({
			status: true,
			groupId: true,
			receiverId: true,
		}),
	});

	const [[theirMembership, membership, outgoingInvitations, user]] =
		api.useSuspenseQueries((t) => [
			t.memberships.byAccountId({ accountId: profile.user.id }),
			t.memberships.getCurrent(),
			t.invitations.getOutgoing(),
			t.users.byId({ id: profile.profile.accountId }),
		]);

	const context = api.useContext();

	const createInvitation = api.invitations.create.useMutation({
		onSuccess: async () => {
			await context.invitations.invalidate();
			toast.success("Invitation sent");
		},
		onError: () => {
			toast.error("Failed to send invitation");
		},
	});

	const cancelInvitation = api.invitations.delete.useMutation({
		onSuccess: async () => {
			await context.invitations.invalidate();
			toast.success("Invitation canceled");
		},
		onError: () => {
			toast.error("Failed to cancel invitation");
		},
	});

	if (!membership)
		return (
			<DashboardCard>
				<div>
					Join or{" "}
					<span>
						<Link className="link" href="/manage">
							create
						</Link>{" "}
					</span>
					a group to invite others.
				</div>
			</DashboardCard>
		);

	if (theirMembership)
		return <DashboardCard>This user is already in a group.</DashboardCard>;

	const invitation = outgoingInvitations?.find(
		(invitation) =>
			invitation.receiverId === profile.user.id &&
			invitation.status === InvitationStatus.PENDING
	);

	return (
		<DashboardCard>
			{invitation ? (
				<div className="flex items-center justify-between gap-4">
					<span className="text-sm font-bold opacity-50">
						Invitation pending.
					</span>
					<button
						type="button"
						onClick={() => cancelInvitation.mutate({ id: invitation.id })}
						className="btn btn-error btn-sm"
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
								receiverId: profile.user.id,
								groupId: membership.groupId,
							});
						})}
					>
						<div>
							<label className="label">
								<span className="label-text">
									Send an optional message to {user.username}
								</span>
							</label>
							<textarea
								className="textarea textarea-bordered h-24 w-full"
								placeholder="Hi, would you like to join my group?"
								{...methods.register("message")}
							/>
							<span className="text-xs text-error">
								{methods.formState.errors.message?.message}
							</span>
						</div>
						<div className="form-control">
							<button type="submit" className="btn btn-primary mt-2">
								Send
							</button>
						</div>
					</form>
				</>
			)}
		</DashboardCard>
	);
}
