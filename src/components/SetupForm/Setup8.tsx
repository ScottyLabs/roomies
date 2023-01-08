import { Volume } from "@prisma/client";
import { useRouter } from "next/router";
import { ProfileCreateSchema } from "../../server/common/schemas";
import { ProfileDescriptions } from "../../types/constants";
import { useProfileStore, useZodForm } from "../../utils";

export const Setup8: React.FC = () => {
	const updateProfile = useProfileStore();
	const router = useRouter();

	const methods = useZodForm({
		schema: ProfileCreateSchema.pick({
			wake: true,
			time_to_ready: true,
			day_volume: true,
		}),
		defaultValues: updateProfile.profile,
	});

	return (
		<div className="flex flex-col items-center gap-4">
			<h1 className="text-5xl font-extrabold tracking-tight text-white">
				<span className="text-primary">Day Time</span>
			</h1>
			<form
				className="form-control w-full max-w-sm gap-2"
				onSubmit={methods.handleSubmit(async (values) => {
					updateProfile.update(values);
					router.push("/setup/9");
				})}
			>
				<div>
					<label className="label">
						<span className="label-text">{ProfileDescriptions.wake}</span>
					</label>
					<input
						type="time"
						className="input w-full"
						{...methods.register("wake")}
					/>
					<span className="text-xs text-error">
						{methods.formState.errors.wake?.message}
					</span>
				</div>
				<div>
					<label className="label">
						<span className="label-text">
							{ProfileDescriptions.time_to_ready}
						</span>
					</label>
					<input
						type="number"
						step={1}
						className="input w-full"
						{...methods.register("time_to_ready")}
					/>
					<span className="text-xs text-error">
						{methods.formState.errors.time_to_ready?.message}
					</span>
				</div>
				<div>
					<label className="label">
						<span className="label-text">{ProfileDescriptions.day_volume}</span>
					</label>
					<select className="select w-full" {...methods.register("day_volume")}>
						<option disabled>Choose one</option>
						{Object.values(Volume).map((value) => (
							<option key={value}>{value}</option>
						))}
					</select>
					<span className="text-xs text-error">
						{methods.formState.errors.day_volume?.message}
					</span>
				</div>
				<button type="submit" className="btn-primary btn mt-8">
					Next
				</button>
			</form>
		</div>
	);
};
