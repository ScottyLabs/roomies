import clsx from "clsx";
import type { ProfileKeys } from "../types/constants";
import { ProfileDescriptions, ProfileLabels } from "../types/constants";
import type { useZodForm } from "../utils";

type ProfileFieldProps = React.PropsWithChildren & {
	methods: ReturnType<typeof useZodForm>;
	prop: ProfileKeys;
	transform?: boolean;
};

export default function ProfileField({
	methods,
	prop,
	transform = true,
	children,
}: ProfileFieldProps) {
	return (
		<div className="mx-2">
			<div
				className={clsx(
					`${
						transform && "sm:flex-center flex-col sm:flex-row"
					} flex justify-between gap-2`
				)}
			>
				<div>
					<label className="font-bold">{ProfileLabels[prop]}</label>
					<p className="text-sm font-thin">{ProfileDescriptions[prop]}</p>
				</div>
				<div className="flex flex-col items-end justify-end gap-1 sm:max-w-xs">
					{children}
					<div className="text-xs font-bold text-red-700">
						<>{methods.formState.errors[prop]?.message}</>
					</div>
				</div>
			</div>
		</div>
	);
}
