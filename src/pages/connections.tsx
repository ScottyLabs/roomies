import type { NextPage } from "next";
import Link from "next/link";
import { ConnectionList } from "../components/connections/ConnectionList";
import { MediaList } from "../components/connections/MediaList";
import MainLayout, { DashboardCard } from "../components/MainLayout";

const Connections: NextPage = () => {
	return (
		<MainLayout>
			<div className="w-full text-3xl font-bold">Connections</div>
			<div className="w-full">
				<DashboardCard>
					<div>
						<h3 className="font-bold">Add accounts to your profile</h3>
						<span className="text-sm font-thin">
							This information will not be shared outside of Roomies whatsoever,
							and is used in accordance with the{" "}
							<Link href="/privacy" className="link">
								Privacy Policy
							</Link>
							.
						</span>
					</div>
					<MediaList />
				</DashboardCard>
			</div>
			<ConnectionList />
		</MainLayout>
	);
};

export default Connections;
