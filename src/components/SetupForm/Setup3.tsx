import { Sex } from "@prisma/client";
import { useRouter } from "next/router";
import { ProfileCreateSchema } from "../../server/common/schemas";
import { ProfileDescriptions } from "../../types/constants";
import { useProfileStore, useZodForm } from "../../utils";

export const Setup3: React.FC = () => {
	const updateProfile = useProfileStore();
	const router = useRouter();

	const methods = useZodForm({
		schema: ProfileCreateSchema.pick({
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
						<option selected disabled>
							Pick one
						</option>
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
				<button type="submit" className="btn-primary btn mt-8">
					Next
				</button>
			</form>
		</div>
	);
};
