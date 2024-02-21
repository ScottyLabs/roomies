import { useSession } from "@clerk/nextjs";
import { useProfileStore, useZodForm } from "lib";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { FaCircleNotch } from "react-icons/fa";
import {
	ProfileLabels,
	SetupSections,
	SetupSteps,
	type ProfileKeys,
} from "types/constants";
import { ProfileSchema } from "utils/common/schemas";
import { api } from "utils/trpc";

export const Setup15: React.FC = () => {
	const updateProfile = useProfileStore();
	const router = useRouter();
	const {session} = useSession();

	const createProfile = api.profiles.create.useMutation({
		onSuccess: async () => {
			await router.push("/overview");
			toast.success("Profile created!");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const methods = useZodForm({
		schema: ProfileSchema,
		defaultValues: updateProfile.profile,
	});

	useEffect(() => {
		methods.trigger();
	}, [methods]);

	return (
		<div className="flex flex-col items-center gap-16">
			{methods.formState.isValid ? (
				<>
					<h1 className="text-5xl font-extrabold tracking-tight">
						Congrats,{" "}
						<span className="text-primary">{session?.user?.username}!</span>
					</h1>
					<span className="rounded-md text-2xl shadow-lg">
						Let&apos;s get some roomies.
					</span>
					<form
						onSubmit={methods.handleSubmit((values) => {
							createProfile.mutateAsync(values);
						})}
					>
						<button
							type="submit"
							disabled={createProfile.isPending}
							className="btn btn-outline btn-primary w-40"
						>
							{createProfile.isPending ? (
								<>
									<FaCircleNotch className="animate-spin" />
								</>
							) : (
								<>Create Profile</>
							)}
						</button>
					</form>
				</>
			) : (
				<div className="flex w-full flex-col items-center gap-8 lg:flex-row">
					<div className="flex flex-col gap-4">
						<h1 className="text-5xl font-extrabold tracking-tight">
							<span className="text-primary">Whoops...</span>
						</h1>
						<span className="text-2xl">
							Looks like some fields are incorrect or missing.
						</span>
					</div>
					<div className="m-8 max-h-96 w-full overflow-auto text-xs font-extralight tracking-tighter shadow-2xl">
						<table className="table table-compact w-full">
							<thead>
								<tr>
									<th>Section</th>
									<th>Entry</th>
									<th>Error</th>
								</tr>
							</thead>
							<tbody>
								{Object.entries(methods.formState.errors).map(
									([entry, error]) => (
										<tr key={entry}>
											<th>
												<Link
													className="link"
													href={`/setup/${
														SetupSteps.indexOf(
															SetupSections[entry as ProfileKeys]
														) + 1
													}`}
												>
													{SetupSections[entry as ProfileKeys]}
												</Link>
											</th>
											<td>
												{
													ProfileLabels[
														entry as keyof (typeof methods)["formState"]["errors"]
													]
												}
											</td>
											<td className="font-thin">{error.message}</td>
										</tr>
									)
								)}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
};
