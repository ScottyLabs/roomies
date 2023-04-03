import { useRouter } from "next/router";
import { ProfileSchema } from "../../server/common/schemas";
import { ProfileDescriptions } from "../../types/constants";
import { useProfileStore, useZodForm } from "../../utils";

export const Setup4: React.FC = () => {
	const updateProfile = useProfileStore();
	const router = useRouter();

	const methods = useZodForm({
		schema: ProfileSchema.pick({
			location: true,
			health_concerns: true,
		}),
		defaultValues: updateProfile.profile,
	});

	return (
		<div className="flex flex-col items-center gap-4">
			<h1 className="text-5xl font-extrabold tracking-tight text-white">
				<span className="text-primary">Personal</span> Information
			</h1>
			<form
				className="form-control w-full max-w-sm gap-2"
				onSubmit={methods.handleSubmit(async (values) => {
					updateProfile.update(values);
					router.push("/setup/5");
				})}
			>
				<div>
					<label className="label">
						<span className="label-text">{ProfileDescriptions.location}</span>
					</label>
					<input
						type="text"
						className="input w-full"
						{...methods.register("location")}
					/>
					<span className="text-xs text-error">
						{methods.formState.errors.location?.message}
					</span>
				</div>
				<div>
					<label className="label">
						<span className="label-text">
							{ProfileDescriptions.health_concerns}
						</span>
					</label>
					<input
						type="text"
						className="input w-full"
						{...methods.register("health_concerns")}
					/>
					<span className="text-xs text-error">
						{methods.formState.errors.health_concerns?.message}
					</span>
				</div>
				<button type="submit" className="btn-primary btn mt-8">
					Next
				</button>
			</form>
		</div>
	);
};
