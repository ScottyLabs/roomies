import { useProfileStore, useZodForm } from "lib";
import { useRouter } from "next/router";
import { ProfileDescriptions } from "types/constants";
import { ProfileSchema } from "utils/common/schemas";

export const Setup12: React.FC = () => {
	const updateProfile = useProfileStore();
	const router = useRouter();

	const methods = useZodForm({
		schema: ProfileSchema.pick({
			music: true,
			hobbies: true,
			aesthetic: true,
		}),
		defaultValues: updateProfile.profile,
	});

	return (
		<div className="flex flex-col items-center gap-4">
			<h1 className="text-5xl font-extrabold tracking-tight text-white">
				Your <span className="text-primary">Artistic</span> Views
			</h1>
			<form
				className="form-control w-full max-w-sm gap-2"
				onSubmit={methods.handleSubmit(async (values) => {
					updateProfile.update(values);
					router.push("/setup/13");
				})}
			>
				<div>
					<label className="label flex-1">
						<span className="label-text">{ProfileDescriptions.music}</span>
					</label>
					<input
						type="text"
						className="input w-full"
						{...methods.register("music")}
					/>
					<span className="text-xs text-error">
						{methods.formState.errors.music?.message}
					</span>
				</div>
				<div>
					<label className="label flex-1">
						<span className="label-text">{ProfileDescriptions.hobbies}</span>
					</label>
					<input
						type="text"
						className="input w-full"
						{...methods.register("hobbies")}
					/>
					<span className="text-xs text-error">
						{methods.formState.errors.hobbies?.message}
					</span>
				</div>
				<div>
					<label className="label flex-1">
						<span className="label-text">{ProfileDescriptions.aesthetic}</span>
					</label>
					<input
						type="text"
						className="input w-full"
						{...methods.register("aesthetic")}
					/>
					<span className="text-xs text-error">
						{methods.formState.errors.aesthetic?.message}
					</span>
				</div>
				<button type="submit" className="btn btn-primary mt-8">
					Next
				</button>
			</form>
		</div>
	);
};
