import { ShowerTime } from "@prisma/client";
import { useRouter } from "next/router";
import { ProfileSchema } from "../../server/common/schemas";
import { ProfileDescriptions } from "../../types/constants";
import { useProfileStore, useZodForm } from "../../utils";

export const Setup10: React.FC = () => {
	const updateProfile = useProfileStore();
	const router = useRouter();

	const methods = useZodForm({
		schema: ProfileSchema.pick({
			shower_time: true,
			study_preferences: true,
			neatness: true,
			social_energy_level: true,
		}),
		defaultValues: updateProfile.profile,
	});

	return (
		<div className="flex flex-col items-center gap-4">
			<h1 className="text-5xl font-extrabold tracking-tight text-white">
				<span className="text-primary">Habitual</span> Info
			</h1>
			<form
				className="form-control w-full max-w-sm gap-2"
				onSubmit={methods.handleSubmit(async (values) => {
					updateProfile.update(values);
					router.push("/setup/11");
				})}
			>
				<div>
					<label className="label">
						<span className="label-text">
							{ProfileDescriptions.shower_time}
						</span>
					</label>
					<select
						className="select w-full"
						{...methods.register("shower_time")}
					>
						{Object.values(ShowerTime).map((value) => (
							<option key={value}>{value}</option>
						))}
					</select>
					<span className="text-xs text-error">
						{methods.formState.errors.shower_time?.message}
					</span>
				</div>
				<div>
					<label className="label">
						<span className="label-text">
							{ProfileDescriptions.study_preferences}
						</span>
					</label>
					<input
						type="text"
						className="input w-full"
						{...methods.register("study_preferences")}
					/>
					<span className="text-xs text-error">
						{methods.formState.errors.study_preferences?.message}
					</span>
				</div>
				<div>
					<label className="label">
						<span className="label-text">{ProfileDescriptions.neatness}</span>
					</label>
					<input
						type="range"
						className="range w-full"
						{...methods.register("neatness")}
					/>
					<span className="text-xs text-error">
						{methods.formState.errors.neatness?.message}
					</span>
				</div>
				<div>
					<label className="label">
						<span className="label-text">
							{ProfileDescriptions.social_energy_level}
						</span>
					</label>
					<input
						type="range"
						className="range w-full"
						{...methods.register("social_energy_level")}
					/>
					<span className="text-xs text-error">
						{methods.formState.errors.social_energy_level?.message}
					</span>
				</div>
				<button type="submit" className="btn-primary btn mt-8">
					Next
				</button>
			</form>
		</div>
	);
};
