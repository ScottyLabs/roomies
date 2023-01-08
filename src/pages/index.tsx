import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

import BaseLayout from "../components/BaseLayout";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
	const users = trpc.user.getAll.useQuery();
	const { data: sessionData } = useSession();

	const [exploreHover, setExploreHover] = useState(false);

	console.log(exploreHover);

	return (
		<BaseLayout>
			<h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
				Find your <span className="text-primary">Roomies!</span>
			</h1>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
				<Link
					className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
					href="/setup/1"
				>
					<h3 className="text-2xl font-bold">First Steps →</h3>
					<div className="text-lg">
						Just the basics - Everything we need to know to set up your profile.
					</div>
				</Link>
				<Link
					className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
					href="/explore"
					onMouseOver={() => setExploreHover(true)}
					onMouseOut={() => setExploreHover(false)}
				>
					<h3 className="text-2xl font-bold">Explore →</h3>
					<div className="text-lg">
						Find the perfect{" "}
						<div className="relative inline-block h-[24px] w-32 translate-y-[3px] overflow-hidden">
							<div
								className={`absolute top-[-16px] transition-all ${
									exploreHover ? "translate-y-[24px]" : "translate-y-0"
								}`}
							>
								<div className="text-xs line-through">soulmate</div>
								<div className="font-bold text-secondary">roomie</div>
							</div>
						</div>
					</div>
				</Link>
			</div>
			<div className="flex flex-col items-center justify-center gap-4">
				{!sessionData && (
					<p className="text-2xl">
						{users.data ? (
							<>
								Join <span className="font-mono">{users.data.length}</span>{" "}
								others!
							</>
						) : (
							"Loading users..."
						)}
					</p>
				)}
				<p className="text-center text-2xl">
					{sessionData && <span>Logged in as {sessionData.user.name}</span>}
				</p>
				<button
					className="btn-ghost btn rounded-full bg-white/10"
					onClick={
						sessionData
							? () => signOut({ redirect: false })
							: () => signIn("google")
					}
				>
					{sessionData ? "Sign out" : "Sign in"}
				</button>
			</div>
		</BaseLayout>
	);
};

export default Home;
