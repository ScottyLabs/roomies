"use client";

import { SignInButton, SignOutButton, useSession } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { api } from "utils/trpc";

function Login() {
	const [count] = api.accounts.count.useSuspenseQuery();
	const { session, isSignedIn } = useSession();

	return (
		<div className="flex flex-col items-center justify-center gap-4">
			<p className="text-center text-2xl">
				{isSignedIn ? (
					<span>
						Logged in as {session.user.firstName} {session.user.lastName}
					</span>
				) : (
					<span>
						Join <span className="font-mono">{count}</span> others!
					</span>
				)}
			</p>
			{isSignedIn ? (
				<SignOutButton>
					<button className="btn btn-ghost rounded-full bg-white/10">
						Sign out
					</button>
				</SignOutButton>
			) : (
				<SignInButton>
					<button className="btn btn-ghost rounded-full bg-white/10">
						Sign in
					</button>
				</SignInButton>
			)}
		</div>
	);
}

export default function Page() {
	const [exploreHover, setExploreHover] = useState(false);

	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
			<div className="container flex w-full flex-col items-center justify-center gap-12 px-4 py-16">
				<div className="flex flex-col items-center justify-center gap-4">
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
								Just the basics - Everything we need to know to set up your
								profile.
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
					<div className="h-20">
						<Login />
					</div>
				</div>
			</div>
		</main>
	);
}
