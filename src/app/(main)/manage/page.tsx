import Groupless from "components/Groupless";
import { api } from "utils/trpc";
import { ActionCard } from "./ActionCard";
import { GroupCard } from "./GroupCard";

export default function Page() {
	const [membership] = api.memberships.getCurrent.useSuspenseQuery();

	if (!membership) return <Groupless />;

	return (
		<>
			<div className="w-full text-3xl font-bold">Your Roommate Group</div>
			<GroupCard membership={membership} />
			<ActionCard membership={membership} />
		</>
	);
}
