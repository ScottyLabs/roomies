"use client";

import { Sex } from "@prisma/client";
import { useProfileStore, useZodForm } from "lib";
import { useRouter } from "next/navigation";
import { ProfileDescriptions } from "types/constants";
import { ProfileSchema } from "utils/common/schemas";

export const Setup3: React.FC = () => {
	const updateProfile = useProfileStore();
	const router = useRouter();

	const methods = useZodForm({
		schema: ProfileSchema.pick({
			assigned_sex: true,
			sexual_orientation: true,
			pronouns: true,
		}),
		defaultValues: updateProfile.profile,
	});

	return (
		<div className="flex flex-col items-center gap-4">
			<h1 className="text-5xl font-extrabold tracking-tight text-white">
				Your <span className="text-primary">Personal</span> Identity
			</h1>
			<form
				className="form-control w-full max-w-sm gap-2"
				onSubmit={methods.handleSubmit(async (values) => {
					updateProfile.update(values);
					router.push("/setup/4");
				})}
			>
				<div>
					<label className="label">
						<span className="label-text">
							{ProfileDescriptions.assigned_sex}
						</span>
					</label>
					<select
						className="select w-full"
						{...methods.register("assigned_sex")}
					>
						{Object.values(Sex).map((value) => (
							<option key={value}>{value}</option>
						))}
					</select>
					<span className="text-xs text-error">
						{methods.formState.errors.assigned_sex?.message}
					</span>
				</div>
				<div>
					<label className="label">
						<span className="label-text">
							{ProfileDescriptions.sexual_orientation}
						</span>
					</label>
					<input
						type="text"
						className="input w-full"
						{...methods.register("sexual_orientation")}
					/>
					<span className="text-xs text-error">
						{methods.formState.errors.sexual_orientation?.message}
					</span>
				</div>
				<div>
					<label className="label">
						<span className="label-text">{ProfileDescriptions.pronouns}</span>
					</label>
					<input
						type="text"
						className="input w-full"
						{...methods.register("pronouns")}
					/>
					<span className="text-xs text-error">
						{methods.formState.errors.pronouns?.message}
					</span>
				</div>
				<button type="submit" className="btn btn-primary mt-8">
					Next
				</button>
			</form>
		</div>
	);
};
