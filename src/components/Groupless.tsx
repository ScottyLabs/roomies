import { Role } from "@prisma/client";
import { toast } from "react-hot-toast";
import { api } from "utils/trpc";
import { DashboardCard } from "./DashboardCard";
import IncomingInvitation from "./IncomingInvitation";

export default function Groupless() {
	const [incomingInvitations] = api.invitations.getIncoming.useSuspenseQuery();

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

	const createGroup = api.groups.create.useMutation({
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

	return (
		<>
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
						<IncomingInvitation invitation={invitation} key={invitation.id} />
					))}
				</div>
			</DashboardCard>
			<div className="w-full">
				<div className="divider w-full max-w-3xl">OR</div>
			</div>
			<DashboardCard>
				<button
					type="button"
					onClick={() => createGroup.mutate()}
					className="btn btn-primary w-full"
				>
					Create a new group
				</button>
			</DashboardCard>
		</>
	);
}
