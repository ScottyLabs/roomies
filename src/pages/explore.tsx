import type { User } from "@prisma/client";
import { Profile } from "@prisma/client";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import MainLayout from "../components/MainLayout";
import { trpc } from "../utils/trpc";

type ProfileProps = {
	profile: Profile & {
		user: User;
	};
};

const Profile = ({ profile }: ProfileProps) => {
	return (
		<article className="relative w-full max-w-sm overflow-hidden rounded-lg bg-base-300 shadow-2xl hover:bg-base-100">
			<Link className="absolute inset-0" href={`/profiles/${profile.id}`} />
			<div className="flex aspect-[19/9] w-full">
				<Image
					className="object-cover"
					src={profile.user.image ?? ""}
					alt={profile.userId}
					height={384}
					width={384}
				/>
			</div>
			<div>
				<div className="flex h-1 items-center gap-2 overflow-visible bg-accent px-4">
					<div className="badge-accent badge badge-lg">
						<span className="font-bold">{profile.school}</span>
					</div>
					<div className="badge-accent badge badge-lg">
						<span className="font-bold">{profile.assigned_sex}</span>
					</div>
				</div>
				<div className="flex flex-col p-4">
					<span className="text-xl font-bold">
						{profile.user.name}{" "}
						{profile.pronouns && <span>{profile.pronouns}</span>}
					</span>
					<span className="text-sm font-thin">{profile.user.email}</span>
				</div>
			</div>
		</article>
	);
};

type ProfilesProps = {
	query: string;
};

function Profiles({ query }: ProfilesProps) {
	const { data: profiles, status } = trpc.profile.getAll.useQuery();

	if (status === "loading") return <div>Loading...</div>;
	if (status === "error") return <div>Error</div>;

	const filteredProfiles = profiles.filter(
		(profile) =>
			profile.user.name?.toLowerCase().includes(query.toLowerCase()) ||
			profile.user.email?.toLowerCase().includes(query.toLowerCase()) ||
			profile.school.toLowerCase().includes(query.toLowerCase())
	);

	return (
		<>
			{filteredProfiles.map((profile) => (
				<Profile key={profile.id} profile={profile} />
			))}
		</>
	);
}

const Explore: NextPage = () => {
	const [query, setQuery] = useState("");

	return (
		<MainLayout>
			<div className="w-full text-3xl font-bold">Explore</div>
			<input
				type="text"
				className="input-bordered input w-full"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Search"
			/>
			<Profiles query={query} />
		</MainLayout>
	);
};

export default Explore;
