import { Status } from "@prisma/client";
import { useRouter } from "next/router";
import { ProfileSchema } from "../../server/common/schemas";
import { ProfileDescriptions } from "../../types/constants";
import { useProfileStore, useZodForm } from "../../utils";

export const Setup2: React.FC = () => {
	const updateProfile = useProfileStore();
	const router = useRouter();

	const methods = useZodForm({
		schema: ProfileSchema.pick({
			year: true,
			committed: true,
			status: true,
		}),
		defaultValues: updateProfile.profile,
	});

	return (
		<div className="flex flex-col items-center gap-4">
			<h1 className="text-5xl font-extrabold tracking-tight text-white">
				First, some <span className="text-primary">basic</span> information!
			</h1>
			<form
				className="form-control w-full max-w-sm gap-2"
				onSubmit={methods.handleSubmit(async (values) => {
					updateProfile.update(values);
					router.push("/setup/3");
				})}
			>
				<div>
					<label className="label">
						<span className="label-text">{ProfileDescriptions.year}</span>
					</label>
					<input
						type="number"
						className="input w-full"
						{...methods.register("year")}
					/>
					<span className="text-xs text-error">
						{methods.formState.errors.year?.message}
					</span>
				</div>
				<div>
					<label className="label flex-1">
						<span className="label-text">{ProfileDescriptions.committed}</span>
						<input
							type="checkbox"
							className="toggle"
							{...methods.register("committed")}
						/>
					</label>
					<span className="text-xs text-error">
						{methods.formState.errors.committed?.message}
					</span>
				</div>
				<div>
					<label className="label">
						<span className="label-text">{ProfileDescriptions.status}</span>
					</label>
					<select className="select w-full" {...methods.register("status")}>
						{Object.values(Status).map((status) => (
							<option key={status}>{status}</option>
						))}
					</select>
					<span className="text-xs text-error">
						{methods.formState.errors.status?.message}
					</span>
				</div>
				<button type="submit" className="btn-primary btn mt-8">
					Next
				</button>
			</form>
		</div>
	);
};
