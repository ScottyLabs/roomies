import type { User } from "@prisma/client";
import { Profile, School, Sex, Status, Volume } from "@prisma/client";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FaList } from "react-icons/fa";
import { z } from "zod";
import { Dialog } from "../components/Dialog";
import MainLayout from "../components/MainLayout";
import { ProfileSearchSchema } from "../server/common/schemas";
import { useZodForm } from "../utils";
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
	filter: z.infer<typeof ProfileSearchSchema>;
};

function Profiles({ query, filter }: ProfilesProps) {
	const { data: profiles, status } = trpc.profile.getAll.useQuery();

	if (status === "loading") return <div>Loading...</div>;
	if (status === "error") return <div>Error</div>;

	const filteredProfiles = profiles.filter((profile) => {
		console.log(filter);

		if (!filter.alcohol && profile.alcohol) return false;
		if (filter.assigned_sex && filter.assigned_sex !== profile.assigned_sex)
			return false;
		if (!filter.committed && profile.committed) return false;
		if (filter.day_volume && filter.day_volume !== profile.day_volume)
			return false;
		if (!filter.drugs && profile.drugs) return false;
		if ((filter.minimum_neatness ?? -10) + 10 > profile.neatness) return false;
		if (filter.night_volume && filter.night_volume !== profile.night_volume)
			return false;
		if (filter.school && filter.school !== profile.school) return false;
		if (!filter.snore && profile.snore) return false;
		if (
			(filter.minimum_social_energy_level ?? -10) + 10 >
			profile.social_energy_level
		)
			return false;
		if (filter.status && filter.status !== profile.status) return false;

		return (
			profile.user.name?.toLowerCase().includes(query.toLowerCase()) ||
			profile.user.email?.toLowerCase().includes(query.toLowerCase()) ||
			profile.school.toLowerCase().includes(query.toLowerCase())
		);
	});

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
	const [filter, setFilter] = useState({});
	const [open, setOpen] = useState(false);

	const methods = useZodForm({
		schema: ProfileSearchSchema,
		defaultValues: {
			alcohol: false,
			assigned_sex: null,
			committed: null,
			day_volume: null,
			drugs: false,
			minimum_neatness: null,
			minimum_social_energy_level: null,
			night_volume: null,
			school: null,
			snore: null,
			status: null,
		},
	});

	return (
		<>
			<Dialog isOpen={open} onClose={() => setOpen(false)}>
				<div className="text-lg font-medium leading-6">Filter Profiles</div>
				<form
					onSubmit={methods.handleSubmit(
						(data) => {
							setFilter(data);
							setOpen(false);
						},
						(e) =>
							toast.error(
								Object.entries(e).reduce(
									(acc, cur) => acc + `${cur[0]}: ${cur[1].message}\n`,
									""
								)
							)
					)}
					className="form-control m-2 gap-5"
				>
					<div className="flex flex-col">
						<div className="bg-base-200 px-2 py-1">
							<span className="text-xs font-bold uppercase">General</span>
						</div>
						<div className="form-control bg-base-300 p-2">
							<label className="label cursor-pointer gap-2">
								<span className="label-text">Committed</span>
								<input
									type="checkbox"
									className="checkbox"
									{...methods.register("committed")}
								/>
							</label>
							<label className="label cursor-pointer gap-2">
								<span className="label-text">Status</span>
								<select
									className="select select-sm"
									{...methods.register("status")}
								>
									{Object.values(Status).map((status) => (
										<option key={status} value={status}>
											{status}
										</option>
									))}
								</select>
							</label>
							<label className="label cursor-pointer gap-2">
								<span className="label-text">Assigned Sex</span>
								<select
									className="select select-sm"
									{...methods.register("assigned_sex")}
								>
									{Object.values(Sex).map((sex) => (
										<option key={sex} value={sex}>
											{sex}
										</option>
									))}
								</select>
							</label>
							<label className="label cursor-pointer gap-2">
								<span className="label-text">School</span>
								<select
									className="select select-sm"
									{...methods.register("school")}
								>
									{Object.values(School).map((school) => (
										<option key={school} value={school}>
											{school}
										</option>
									))}
								</select>
							</label>
						</div>
					</div>
					<div className="flex flex-col">
						<div className="bg-base-200 px-2 py-1">
							<span className="text-xs font-bold uppercase">Dorm Life</span>
						</div>
						<div className="form-control bg-base-300 p-2">
							<label className="label cursor-pointer gap-2">
								<span className="label-text">Day Volume</span>
								<select
									className="select select-sm"
									{...methods.register("day_volume")}
								>
									{Object.values(Volume).map((volume) => (
										<option key={volume} value={volume}>
											{volume}
										</option>
									))}
								</select>
							</label>
							<label className="label cursor-pointer gap-2">
								<span className="label-text">Night Volume</span>
								<select
									className="select select-sm"
									{...methods.register("night_volume")}
								>
									{Object.values(Volume).map((volume) => (
										<option key={volume} value={volume}>
											{volume}
										</option>
									))}
								</select>
							</label>
							<label className="label cursor-pointer gap-2">
								<span className="label-text">Snore?</span>
								<input
									type="checkbox"
									className="checkbox"
									{...methods.register("snore")}
								/>
							</label>
							<label className="label cursor-pointer gap-2">
								<span className="label-text">Minimum Neatness</span>
								<input
									type="range"
									className="range range-sm"
									{...methods.register("minimum_neatness")}
								/>
							</label>
						</div>
					</div>
					<div className="flex flex-col">
						<div className="bg-base-200 px-2 py-1">
							<span className="text-xs font-bold uppercase">Social/Drugs</span>
						</div>
						<div className="form-control bg-base-300 p-2">
							<label className="label cursor-pointer gap-2">
								<span className="label-text">Minimum Social Energy Level</span>
								<input
									type="range"
									className="range range-sm"
									{...methods.register("minimum_social_energy_level")}
								/>
							</label>
							<label className="label cursor-pointer gap-2">
								<span className="label-text">Alcohol</span>
								<input
									type="checkbox"
									className="checkbox"
									{...methods.register("alcohol")}
								/>
							</label>
							<label className="label cursor-pointer gap-2">
								<span className="label-text">Drugs</span>
								<input
									type="checkbox"
									className="checkbox"
									{...methods.register("drugs")}
								/>
							</label>
						</div>
					</div>
					<div>
						<button type="submit" className="btn-primary btn-sm btn w-full">
							Apply
						</button>
					</div>
				</form>
			</Dialog>

			<MainLayout>
				<div className="w-full text-3xl font-bold">Explore</div>
				<div className="w-full">
					<label className="input-group">
						<input
							type="text"
							className="input-bordered input w-full max-w-3xl"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search"
						/>
						<button
							type="button"
							onClick={() => setOpen(true)}
							className="btn-secondary btn-square btn"
						>
							<FaList className="h-6 w-6" />
						</button>
					</label>
				</div>
				<Profiles query={query} filter={filter} />
			</MainLayout>
		</>
	);
};

export default Explore;
