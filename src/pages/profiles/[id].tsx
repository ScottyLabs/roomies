import { InvitationStatus } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import MainLayout, { DashboardCard } from "../../components/MainLayout";
import { InvitationCreateSchema } from "../../server/common/schemas";
import { useZodForm } from "../../utils";
import type { RouterOutputs } from "../../utils/trpc";
import { trpc } from "../../utils/trpc";

type InvitationCardProps = {
	profile: NonNullable<RouterOutputs["profile"]["byId"]>;
};

const InvitationCard = ({ profile }: InvitationCardProps) => {
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

	if (!membership) return <div>Group not found</div>;
	if (theirMembership) return <div>Already in group</div>;

	return (
		<DashboardCard>
			{outgoingInvitations.some(
				(invitation) =>
					invitation.receiverId === profile.userId &&
					invitation.status === InvitationStatus.PENDING
			) ? (
				<div className="flex items-center justify-between gap-4">
					<span className="text-sm font-bold opacity-50">
						You have already sent an invitation to {profile.user.name}.
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
};

const ProfilePage = () => {
	const router = useRouter();
	const { id } = router.query;

	const { data: profile, status: profileStatus } = trpc.profile.byId.useQuery(
		{ id: id as string },
		{ enabled: typeof id === "string" }
	);

	if (profileStatus === "loading") return <div>Loading...</div>;
	if (profileStatus === "error") return <div>Error</div>;
	if (!profile) return <div>Profile not found</div>;

	return (
		<MainLayout>
			<div className="w-full text-3xl font-bold">{profile.user.name}</div>
			<div className="flex w-full flex-col gap-2">
				<DashboardCard>
					<div className="flex flex-row items-center gap-4">
						<div className="avatar">
							<div className="mask mask-squircle w-24">
								<Image
									src={profile.user.image ?? ""}
									alt=""
									width={128}
									height={128}
								/>
							</div>
						</div>
						<div>
							<div className="text-2xl font-bold">
								{profile.user.name}{" "}
								<span>{profile.pronouns && `(${profile.pronouns})`}</span>
							</div>
							<div className="leading-4 opacity-50">{profile.user.email}</div>
							<div className="text-sm font-bold text-red-400">
								Carnegie Mellon University @ {profile.year}
							</div>
						</div>
					</div>
					<div>
						<div className="text-xl font-bold">General Info</div>
						<div>
							<div>
								Year: <span className="font-bold">{profile.year}</span>
							</div>
							<div>
								Committed:{" "}
								<span className="font-bold">
									{profile.committed ? "Yes" : "No"}
								</span>
							</div>
							<div>
								Status: <span className="font-mono">{profile.status}</span>
							</div>
						</div>
					</div>
				</DashboardCard>
				<InvitationCard profile={profile} />
			</div>
		</MainLayout>
	);
};

export default ProfilePage;
