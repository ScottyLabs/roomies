import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, type PropsWithChildren } from "react";
import {
	FaBars,
	FaDiscourse,
	FaEnvelope,
	FaGithub,
	FaHouseUser,
	FaMapMarked,
	FaSearchLocation,
	FaUser,
	FaUserFriends,
} from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { api } from "utils/trpc";

export default function Layout({ children }: PropsWithChildren) {
	const invitations = api.invitations.getIncoming.useQuery();
	const router = useRouter();

	useEffect(() => {
		const drawer = document.getElementById("my-drawer-2") as HTMLInputElement;
		if (drawer) drawer.checked = false;
	}, [router.pathname]);

	return (
		<div className="drawer drawer-mobile">
			<input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
			<div className="drawer-content">
				<nav className="navbar sticky top-0 z-50 w-full bg-base-300 bg-opacity-50 backdrop-blur">
					<div className="flex-none lg:hidden">
						<label
							htmlFor="my-drawer-2"
							className="btn btn-circle swap btn-ghost swap-rotate"
						>
							<input type="checkbox" />
							<FaBars className="swap-off fill-current" />
							<ImCross className="swap-on fill-current" />
						</label>
					</div>
					<div className="flex flex-1 items-center gap-2 px-4 py-2 lg:hidden">
						<Link href="/" className="flex-0 btn btn-ghost px-2">
							<div className="font-title inline-flex text-lg text-primary transition-all duration-200 md:text-3xl">
								<span>Roomies</span>
								<span className="text-base-content">!</span>
							</div>
						</Link>
						<span className="link link-hover font-mono text-xs">0.0.1</span>
					</div>
					<div className="navbar-end flex-1">
						<UserButton />
						<Link
							href="https://github.com/adrastopoulos/roomies"
							className="btn btn-circle btn-ghost"
						>
							<FaGithub className="h-6 w-6" />
						</Link>
					</div>
				</nav>
				<div className="flex flex-wrap gap-4 p-4">{children}</div>
			</div>
			<div className="drawer-side">
				<label htmlFor="my-drawer-2" className="drawer-overlay" />
				<aside className="w-80 bg-base-200">
					<div className="sticky top-0 z-20 hidden items-center gap-2 bg-base-200 bg-opacity-90 px-4 py-2 backdrop-blur lg:flex ">
						<Link href="/" className="flex-0 btn btn-ghost px-2">
							<div className="font-title inline-flex text-lg text-primary transition-all duration-200 md:text-3xl">
								<span>Roomies</span>
								<span className="text-base-content">!</span>
							</div>
						</Link>
						<span className="link link-hover font-mono text-xs">0.0.1</span>
					</div>
					<ul className="menu p-4 text-base-content">
						<li className="menu-title">
							<span>User Settings</span>
						</li>
						<li>
							<Link href="/profile">
								<FaUser /> <span>Profile</span>
							</Link>
						</li>
						<li>
							<Link href="/connections">
								<FaUserFriends />
								<span>Connections</span>
							</Link>
						</li>
						<li />
						<li className="menu-title">
							<span>Find Your Roomies</span>
						</li>
						<li>
							<Link href="/explore">
								<FaMapMarked />
								<span>Explore</span>
							</Link>
						</li>
						<li>
							<Link href="/invitations" className="flex justify-between">
								<FaEnvelope />
								<span className="flex-1">Invitations</span>
								{!!invitations?.data?.length && (
									<span className="badge badge-accent badge-sm float-right">
										{invitations.data.length} INCOMING
									</span>
								)}
							</Link>
						</li>
						<li>
							<Link href="/manage">
								<FaHouseUser />
								<span>Manage</span>
							</Link>
						</li>
						<li />
						<li className="menu-title">
							<span>Legal</span>
						</li>
						<li>
							<Link href="/privacy">
								<FaSearchLocation />
								<span>Privacy</span>
							</Link>
						</li>
						<li>
							<Link href="/tos">
								<FaDiscourse />
								<span>TOS</span>
							</Link>
						</li>
					</ul>
				</aside>
			</div>
		</div>
	);
}
