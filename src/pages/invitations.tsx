import { InvitationStatus, Role } from "@prisma/client";
import type { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Groupless from "../components/Groupless";
import MainLayout, { DashboardCard } from "../components/MainLayout";
import { prisma } from "../server/db/client";
import type { RouterOutputs } from "../utils/trpc";
import { trpc } from "../utils/trpc";
import { authOptions } from "./api/auth/[...nextauth]";

type InvitationManagerProps = {
	membership: NonNullable<RouterOutputs["membership"]["getCurrent"]>;
};

const InvitationManager = ({ membership }: InvitationManagerProps) => {
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
									className="link-secondary link text-xl font-bold"
									href={`/users/${invitation.receiverId}`}
								>
									{invitation.receiver.name}
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
			<InvitationManager membership={membership} />
		</MainLayout>
	);
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const session = await unstable_getServerSession(
		ctx.req,
		ctx.res,
		authOptions
	);

	const profile = await prisma.profile.findUnique({
		where: {
			userId: session?.user.id,
		},
	});

	if (!profile)
		return {
			redirect: {
				destination: "/setup/1",
				permanent: true,
			},
		};

	return {
		props: {},
	};
};
