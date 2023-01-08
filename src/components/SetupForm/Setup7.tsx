import { Bathroom, Dorm } from "@prisma/client";
import { useRouter } from "next/router";
import { ProfileCreateSchema } from "../../server/common/schemas";
import { ProfileDescriptions } from "../../types/constants";
import { useProfileStore, useZodForm } from "../../utils";

export const Setup7: React.FC = () => {
	const updateProfile = useProfileStore();
	const router = useRouter();

	const methods = useZodForm({
		schema: ProfileCreateSchema.pick({
			preferred_dorm: true,
			bathroom_preference: true,
			quiet_dorm: true,
		}),
		defaultValues: updateProfile.profile,
	});

	return (
		<div className="flex flex-col items-center gap-4">
			<h1 className="text-5xl font-extrabold tracking-tight text-white">
				<span className="text-primary">Dorm</span> Topics
			</h1>
			<form
				className="form-control w-full max-w-sm gap-2"
				onSubmit={methods.handleSubmit(async (values) => {
					updateProfile.update(values);
					router.push("/setup/8");
				})}
			>
				<div>
					<label className="label">
						<span className="label-text">
							{ProfileDescriptions.preferred_dorm}
						</span>
					</label>
					<select
						className="select w-full"
						multiple
						{...methods.register("preferred_dorm")}
					>
						<option disabled>Choose one or more</option>
						{Object.values(Dorm).map((value) => (
							<option key={value}>{value}</option>
						))}
					</select>
					<span className="text-xs text-error">
						{methods.formState.errors.preferred_dorm instanceof Array
							? methods.formState.errors.preferred_dorm
									?.map((error) => error?.message)
									.join(", ")
							: methods.formState.errors.preferred_dorm?.message}
					</span>
				</div>
				<div>
					<label className="label">
						<span className="label-text">
							{ProfileDescriptions.bathroom_preference}
						</span>
					</label>
					<select
						className="select select-multiple w-full"
						multiple
						{...methods.register("bathroom_preference")}
					>
						<option disabled>Choose one or more</option>
						{Object.values(Bathroom).map((value) => (
							<option key={value}>{value}</option>
						))}
					</select>
					<span className="text-xs text-error">
						{methods.formState.errors.bathroom_preference instanceof Array
							? methods.formState.errors.bathroom_preference
									?.map((error) => error?.message)
									.join(", ")
							: methods.formState.errors.bathroom_preference?.message}
					</span>
				</div>
				<div>
					<label className="label">
						<span className="label-text">{ProfileDescriptions.quiet_dorm}</span>
						<input
							type="checkbox"
							className="toggle"
							{...methods.register("quiet_dorm")}
						/>
					</label>
					<span className="text-xs text-error">
						{methods.formState.errors.quiet_dorm?.message}
					</span>
				</div>
				<button type="submit" className="btn-primary btn mt-8">
					Next
				</button>
			</form>
		</div>
	);
};
