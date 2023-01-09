import { School } from "@prisma/client";
import { useRouter } from "next/router";
import { ProfileCreateSchema } from "../../server/common/schemas";
import { ProfileDescriptions } from "../../types/constants";
import { useProfileStore, useZodForm } from "../../utils";

export const Setup5: React.FC = () => {
	const updateProfile = useProfileStore();
	const router = useRouter();

	const methods = useZodForm({
		schema: ProfileCreateSchema.pick({
			schools: true,
		}),
		defaultValues: updateProfile.profile,
	});

	return (
		<div className="flex flex-col items-center gap-4">
			<h1 className="text-5xl font-extrabold tracking-tight text-white">
				School <span className="text-primary">Preferences</span>
			</h1>
			<form
				className="form-control w-full max-w-sm gap-2"
				onSubmit={methods.handleSubmit(async (values) => {
					updateProfile.update(values);
					router.push("/setup/6");
				})}
			>
				<div>
					<label className="label">
						<span className="label-text">{ProfileDescriptions.schools}</span>
					</label>
					<select
						className="select select-multiple w-full"
						multiple
						{...methods.register("schools")}
					>
						{Object.values(School).map((value) => (
							<option key={value}>{value}</option>
						))}
					</select>
					<span className="text-xs text-error">
						{methods.formState.errors.schools instanceof Array
							? methods.formState.errors.schools
									?.map((error) => error?.message)
									.join(", ")
							: methods.formState.errors.schools?.message}
					</span>
				</div>
				<button type="submit" className="btn-primary btn mt-8">
					Next
				</button>
			</form>
		</div>
	);
};
