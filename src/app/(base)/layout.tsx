import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
	title: "Roomies!",
	description: "Find your dream roommate!",
	icons: "/favicon.ico",
};

export default function Layout({ children }: PropsWithChildren) {
	<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
		<div className="container flex w-full flex-col items-center justify-center gap-12 px-4 py-16">
			{children}
		</div>
	</main>;
}
