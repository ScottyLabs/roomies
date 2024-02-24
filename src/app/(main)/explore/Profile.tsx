import Image from "next/image";
import Link from "next/link";
import type { RouterOutputs } from "utils/trpc";

type ProfileProps = RouterOutputs["profiles"]["getAll"][number];

export const Profile = ({ profile, user }: ProfileProps) => {
	return (
		<article className="relative w-full max-w-sm overflow-hidden rounded-lg bg-base-300 shadow-2xl hover:bg-base-100">
			<Link className="absolute inset-0" href={`/profiles/${profile.id}`} />
			<div className="flex aspect-[19/9] w-full">
				<Image
					className="object-cover"
					src={user.imageUrl ?? ""}
					alt={user.id}
					height={384}
					width={384}
				/>
			</div>
			<div>
				<div className="flex h-1 items-center gap-2 overflow-visible bg-accent px-4">
					<div className="badge badge-accent badge-lg">
						<span className="font-bold">{profile.school}</span>
					</div>
					<div className="badge badge-accent badge-lg">
						<span className="font-bold">{profile.assigned_sex}</span>
					</div>
				</div>
				<div className="flex flex-col p-4">
					<span className="text-xl font-bold">
						{user.username}{" "}
						{profile.pronouns && <span>{profile.pronouns}</span>}
					</span>
					<span className="text-sm font-thin">
						{user.emailAddresses[0]?.emailAddress ?? "None"}
					</span>
				</div>
			</div>
		</article>
	);
};
