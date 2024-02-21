import { SignInButton, SignOutButton, useSession } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { api } from "utils/trpc";

function Login() {
	const [count] = api.accounts.count.useSuspenseQuery();
	const session = useSession();

	return (
		<div className="flex flex-col items-center justify-center gap-4">
			<p className="text-center text-2xl">
				{session.isSignedIn ? (
					<span>Logged in as {session.session.user.username}</span>
				) : (
					<span>
						Join <span className="font-mono">{count}</span> others!
					</span>
				)}
			</p>
			{session.isSignedIn ? <SignOutButton /> : <SignInButton />}
		</div>
	);
}

export default function Page() {
	const [exploreHover, setExploreHover] = useState(false);

	return (
		<>
			<h1 className="sm:text-[5rem] text-5xl font-extrabold tracking-tight">
				Find your <span className="text-primary">Roomies!</span>
			</h1>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
				<Link
					className="hover:bg-white/20 flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4"
					href="/setup/1"
				>
					<h3 className="text-2xl font-bold">First Steps →</h3>
					<div className="text-lg">
						Just the basics - Everything we need to know to set up your profile.
					</div>
				</Link>
				<Link
					className="hover:bg-white/20 flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4"
					href="/explore"
					onMouseOver={() => setExploreHover(true)}
					onMouseOut={() => setExploreHover(false)}
				>
					<h3 className="text-2xl font-bold">Explore →</h3>
					<div className="text-lg">
						Find the perfect{" "}
						<div className="h-[24px] translate-y-[3px] relative inline-block w-32 overflow-hidden">
							<div
								className={`top-[-16px] absolute transition-all ${
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
			<div className="h-20">
				<Login />
			</div>
		</>
	);
}
