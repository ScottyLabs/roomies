import { Volume } from "@prisma/client";
import { useRouter } from "next/router";
import { ProfileCreateSchema } from "../../server/common/schemas";
import { ProfileDescriptions } from "../../types/constants";
import { useProfileStore, useZodForm } from "../../utils";

export const Setup9: React.FC = () => {
	const updateProfile = useProfileStore();
	const router = useRouter();

	const methods = useZodForm({
		schema: ProfileCreateSchema.pick({
			sleep: true,
			sleep_needs: true,
			night_volume: true,
			snore: true,
		}),
		defaultValues: updateProfile.profile,
	});

	return (
		<div className="flex flex-col items-center gap-4">
			<h1 className="text-5xl font-extrabold tracking-tight text-white">
				<span className="text-primary">Night Times</span>
			</h1>
			<form
				className="form-control w-full max-w-sm gap-2"
				onSubmit={methods.handleSubmit(async (values) => {
					updateProfile.update(values);
					router.push("/setup/10");
				})}
			>
				<div>
					<label className="label">
						<span className="label-text">{ProfileDescriptions.sleep}</span>
					</label>
					<input
						type="time"
						className="input w-full"
						{...methods.register("sleep")}
					/>
					<span className="text-xs text-error">
						{methods.formState.errors.sleep?.message}
					</span>
				</div>
				<div>
					<label className="label">
						<span className="label-text">
							{ProfileDescriptions.sleep_needs}
						</span>
					</label>
					<input
						type="text"
						className="input w-full"
						{...methods.register("sleep_needs")}
					/>
					<span className="text-xs text-error">
						{methods.formState.errors.sleep_needs?.message}
					</span>
				</div>
				<div>
					<label className="label">
						<span className="label-text">
							{ProfileDescriptions.night_volume}
						</span>
					</label>
					<select
						className="select w-full"
						{...methods.register("night_volume")}
					>
						{Object.values(Volume).map((value) => (
							<option key={value}>{value}</option>
						))}
					</select>
					<span className="text-xs text-error">
						{methods.formState.errors.night_volume?.message}
					</span>
				</div>
				<div>
					<label className="label">
						<span className="label-text">{ProfileDescriptions.snore}</span>
						<input
							type="checkbox"
							className="toggle"
							{...methods.register("snore")}
						/>
					</label>
					<span className="text-xs text-error">
						{methods.formState.errors.snore?.message}
					</span>
				</div>
				<button type="submit" className="btn-primary btn mt-8">
					Next
				</button>
			</form>
		</div>
	);
};
