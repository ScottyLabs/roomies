"use client";

import { useSession } from "@clerk/nextjs";
import Link from "next/link";

export const Setup1: React.FC = () => {
	const { session } = useSession();

	return (
		<div className="flex flex-col items-center gap-16">
			<h1 className="text-5xl font-extrabold tracking-tight text-white">
				Hello, <span className="text-primary">{session?.user.username}!</span>
			</h1>
			<h3 className="rounded-md text-2xl text-white shadow-lg">
				Let&apos;s set up your account.
			</h3>
			<Link href="/setup/2" className="btn btn-primary">
				Okay!
			</Link>
		</div>
	);
};
