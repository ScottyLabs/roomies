import { useRouter } from "next/router";
import { ProfileSchema } from "../../server/common/schemas";
import { ProfileDescriptions } from "../../types/constants";
import { useProfileStore, useZodForm } from "../../utils";

export const Setup13: React.FC = () => {
	const updateProfile = useProfileStore();
	const router = useRouter();

	const methods = useZodForm({
		schema: ProfileSchema.pick({
			political_spectrum: true,
			religion: true,
			personality_test: true,
		}),
		defaultValues: updateProfile.profile,
	});

	return (
		<div className="flex flex-col items-center gap-4">
			<h1 className="text-5xl font-extrabold tracking-tight text-white">
				<span className="text-primary">Supplements</span>
			</h1>
			<form
				className="form-control w-full max-w-sm gap-2"
				onSubmit={methods.handleSubmit(async (values) => {
					updateProfile.update(values);
					router.push("/setup/14");
				})}
			>
				<div>
					<label className="label flex-1">
						<span className="label-text">
							{ProfileDescriptions.political_spectrum}
						</span>
					</label>
					<input
						type="text"
						className="input w-full"
						{...methods.register("political_spectrum")}
					/>
					<span className="text-xs text-error">
						{methods.formState.errors.political_spectrum?.message}
					</span>
				</div>
				<div>
					<label className="label flex-1">
						<span className="label-text">{ProfileDescriptions.religion}</span>
					</label>
					<input
						type="text"
						className="input w-full"
						{...methods.register("religion")}
					/>
					<span className="text-xs text-error">
						{methods.formState.errors.religion?.message}
					</span>
				</div>
				<div>
					<label className="label flex-1">
						<span className="label-text">
							{ProfileDescriptions.personality_test}
						</span>
					</label>
					<input
						type="text"
						className="input w-full"
						{...methods.register("personality_test")}
					/>
					<span className="text-xs text-error">
						{methods.formState.errors.personality_test?.message}
					</span>
				</div>
				<button type="submit" className="btn-primary btn mt-8">
					Next
				</button>
			</form>
		</div>
	);
};
