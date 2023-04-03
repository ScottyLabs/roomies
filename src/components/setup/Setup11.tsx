import { useRouter } from "next/router";
import { ProfileSchema } from "../../server/common/schemas";
import { ProfileDescriptions } from "../../types/constants";
import { useProfileStore, useZodForm } from "../../utils";

export const Setup11: React.FC = () => {
	const updateProfile = useProfileStore();
	const router = useRouter();

	const methods = useZodForm({
		schema: ProfileSchema.pick({
			alcohol: true,
			drugs: true,
			parties: true,
		}),
		defaultValues: updateProfile.profile,
	});

	return (
		<div className="flex flex-col items-center gap-4">
			<h1 className="text-5xl font-extrabold tracking-tight text-white">
				The <span className="text-primary">Fun</span> Life
			</h1>
			<form
				className="form-control w-full max-w-sm gap-2"
				onSubmit={methods.handleSubmit(async (values) => {
					updateProfile.update(values);
					router.push("/setup/12");
				})}
			>
				<div>
					<label className="label">
						<span className="label-text">{ProfileDescriptions.alcohol}</span>
						<input
							type="checkbox"
							className="checkbox"
							{...methods.register("alcohol")}
						/>
					</label>
					<span className="text-xs text-error">
						{methods.formState.errors.alcohol?.message}
					</span>
				</div>
				<div>
					<label className="label">
						<span className="label-text">{ProfileDescriptions.drugs}</span>
						<input
							type="checkbox"
							className="checkbox"
							{...methods.register("drugs")}
						/>
					</label>
					<span className="text-xs text-error">
						{methods.formState.errors.drugs?.message}
					</span>
				</div>
				<div>
					<label className="label">
						<span className="label-text">{ProfileDescriptions.parties}</span>
					</label>
					<input
						type="text"
						className="input w-full"
						{...methods.register("parties")}
					/>
					<span className="text-xs text-error">
						{methods.formState.errors.parties?.message}
					</span>
				</div>
				<button type="submit" className="btn-primary btn mt-8">
					Next
				</button>
			</form>
		</div>
	);
};
