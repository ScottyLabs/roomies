import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState, type ReactElement } from "react";
import { FaCircleNotch } from "react-icons/fa";
import BaseLayout from "../components/BaseLayout";
import { trpc } from "../utils/trpc";
import { type NextPageWithLayout } from "./_app";

function Login() {
	const users = trpc.user.getAll.useQuery();
	const session = useSession();

	if (users.status === "loading" || session.status === "loading")
		return <FaCircleNotch className="animate-spin" />;
	if (users.status === "error") return <div>Failed to load users</div>;

	return (
		<div className="flex flex-col items-center justify-center gap-4">
			<p className="text-center text-2xl">
				{session.status === "authenticated" ? (
					<span>Logged in as {session.data.user.name}</span>
				) : (
					<span>
						Join <span className="font-mono">{users.data.length}</span> others!
					</span>
				)}
			</p>
			<button
				className="btn-ghost btn rounded-full bg-white/10"
				onClick={
					session.status === "authenticated"
						? () => signOut({ redirect: false })
						: () => signIn("google")
				}
			>
				{session.status === "authenticated" ? "Sign out" : "Sign in"}
			</button>
		</div>
	);
}

const Home: NextPageWithLayout = () => {
	const [exploreHover, setExploreHover] = useState(false);

	return (
		<>
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
			<div className="h-20">
				<Login />
			</div>
		</>
	);
};

Home.getLayout = function getLayout(page: ReactElement) {
	return <BaseLayout>{page}</BaseLayout>;
};

export default Home;
