import { School } from "@prisma/client";
import { useProfileStore, useZodForm } from "lib";
import { useRouter } from "next/router";
import { ProfileDescriptions } from "types/constants";
import { ProfileSchema } from "utils/common/schemas";

export const Setup5: React.FC = () => {
	const updateProfile = useProfileStore();
	const router = useRouter();

	const methods = useZodForm({
		schema: ProfileSchema.pick({
			school: true,
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
						<span className="label-text">{ProfileDescriptions.school}</span>
					</label>
					<select className="select w-full" {...methods.register("school")}>
						{Object.values(School).map((value) => (
							<option key={value}>{value}</option>
						))}
					</select>
					<span className="text-xs text-error">
						{methods.formState.errors.school?.message}
					</span>
				</div>
				<button type="submit" className="btn btn-primary mt-8">
					Next
				</button>
			</form>
		</div>
	);
};
