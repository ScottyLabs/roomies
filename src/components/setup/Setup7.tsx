"use client";

import { Bathroom, Dorm } from "@prisma/client";
import { useProfileStore, useZodForm } from "lib";
import { useRouter } from "next/navigation";
import { ProfileDescriptions } from "types/constants";
import { ProfileSchema } from "utils/common/schemas";

export const Setup7: React.FC = () => {
	const updateProfile = useProfileStore();
	const router = useRouter();

	const methods = useZodForm({
		schema: ProfileSchema.pick({
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
						className="select w-full"
						multiple
						{...methods.register("bathroom_preference")}
					>
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
				<button type="submit" className="btn btn-primary mt-8">
					Next
				</button>
			</form>
		</div>
	);
};
