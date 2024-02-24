import { DashboardCard } from "components/DashboardCard";
import Link from "next/link";

export default function Overview() {
	return (
		<>
			<div className="w-full">
				<DashboardCard>
					<div className="prose prose-sm">
						<h1>A Quick Overview</h1>
						<p>
							Roomies is a platform for finding roommates. It is designed to be
							used by CMU college students.
						</p>
						<h3>How does it work?</h3>
						<p>
							You create a profile, and then you can create a group or join an
							existing one. You can then invite people to your group, or accept
							invitations from others.
						</p>
						<h3>A Profile?</h3>
						<p>
							You will be prompted to create a profile when visiting the
							<code>explore</code>
							page. This begins a multi-step form that will ask you for your
							graduation date, your major, and other information.
						</p>
						<h3>Creating Connections</h3>
						<p>
							Create connections by visiting the <code>connections</code> page.
							You can input your handle for various social media platforms, and
							then other users in your group can connect with you.
						</p>
						<h3>Roomie Group</h3>
						<p>
							You can create a group by visiting the
							<code>invitations</code> or <code>manage</code>
							page.
						</p>
						<h3>Joining a Group</h3>
						<p>
							You can join a group by visiting the
							<code>invitations</code> page. If you have received an invitation,
							you can accept it there.
						</p>
						<h3>Invitations</h3>
						<p>
							You can invite someone to your group by visiting their profile
							from the
							<code>explore</code> page. If they are not in a group, you will
							see an invite button.
						</p>
						<h3>What&apos;s Next?</h3>
						<p>
							You can connect to people in your group by visiting their user
							page. This is accessed via the <code>manage</code> page. On their
							user page, you will see the user&apos;s connections.
						</p>
					</div>
				</DashboardCard>
			</div>
			<div className="w-full">
				<DashboardCard>
					<Link
						className="btn btn-primary w-full text-lg font-bold"
						href="/explore"
					>
						Explore!
					</Link>
				</DashboardCard>
			</div>
		</>
	);
}
