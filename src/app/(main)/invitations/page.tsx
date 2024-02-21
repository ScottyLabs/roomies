import Groupless from "components/Groupless";
import { api } from "utils/trpc";
import { InvitationManager } from "./InvitationManager";

export default function Page() {
	const [[membership, user]] = api.useSuspenseQueries((t) => [
		t.memberships.getCurrent(),
		t.users.me(),
	]);
	if (!membership) return <Groupless />;
	return (
		<>
			<div className="w-full text-3xl font-bold">Your Roommate Group</div>
			<InvitationManager membership={membership} receiver={user} />
		</>
	);
}
