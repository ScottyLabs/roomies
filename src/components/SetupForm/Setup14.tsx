import { useRouter } from "next/router";
import { ProfileCreateSchema } from "../../server/common/schemas";
import { ProfileDescriptions } from "../../types/constants";
import { useProfileStore, useZodForm } from "../../utils";

export const Setup14: React.FC = () => {
	const updateProfile = useProfileStore();
	const router = useRouter();

	const methods = useZodForm({
		schema: ProfileCreateSchema.pick({
			fun_fact: true,
			notes: true,
		}),
		defaultValues: updateProfile.profile,
	});

	return (
		<div className="flex flex-col items-center gap-4">
			<h1 className="text-5xl font-extrabold tracking-tight text-white">
				<span className="text-primary">Wrapping</span> Things Up
			</h1>
			<form
				className="form-control w-full max-w-sm gap-2"
				onSubmit={methods.handleSubmit(async (values) => {
					updateProfile.update(values);
					router.push("/setup/15");
				})}
			>
				<div>
					<label className="label flex-1">
						<span className="label-text">{ProfileDescriptions.fun_fact}</span>
					</label>
					<input
						type="text"
						className="input w-full"
						{...methods.register("fun_fact")}
					/>
					<span className="text-xs text-error">
						{methods.formState.errors.fun_fact?.message}
					</span>
				</div>
				<div>
					<label className="label flex-1">
						<span className="label-text">{ProfileDescriptions.notes}</span>
					</label>
					<textarea
						className="textarea w-full"
						{...methods.register("notes")}
					/>
					<span className="text-xs text-error">
						{methods.formState.errors.notes?.message}
					</span>
				</div>
				<button type="submit" className="btn-primary btn mt-8">
					Next
				</button>
			</form>
		</div>
	);
};
