import { School, Sex, Status, Volume } from "@prisma/client";
import { Dialog } from "components/Dialog";
import { useZodForm } from "lib";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaList } from "react-icons/fa";
import { ProfileSearchSchema } from "utils/common/schemas";
import { Profiles } from "./Profiles";

export default function Page() {
	const [query, setQuery] = useState("");
	const [filter, setFilter] = useState({});
	const [open, setOpen] = useState(false);

	const methods = useZodForm({
		schema: ProfileSearchSchema,
		defaultValues: {
			alcohol: true,
			assigned_sex: null,
			committed: true,
			day_volume: null,
			drugs: true,
			minimum_neatness: 0,
			minimum_social_energy_level: 0,
			night_volume: null,
			school: null,
			snore: true,
			status: null,
		},
	});

	return (
		<>
			<Dialog isOpen={open} onClose={() => setOpen(false)}>
				<div className="flex justify-between">
					<div className="flex-1 text-lg font-medium leading-6">
						Filter Profiles
					</div>
					<button
						onClick={() => {
							methods.reset();
							setFilter({});
							setOpen(false);
						}}
						className="btn btn-accent btn-xs"
					>
						Reset
					</button>
				</div>
				<form
					onSubmit={methods.handleSubmit(
						(data) => {
							setFilter(data);
							setOpen(false);
						},
						(e) =>
							toast.error(
								Object.entries(e).reduce(
									(acc, cur) => acc + `${cur[0]}: ${cur[1].message}\n`,
									""
								)
							)
					)}
					className="form-control m-2 gap-5"
				>
					<div className="flex flex-col">
						<div className="bg-base-200 px-2 py-1">
							<span className="text-xs font-bold uppercase">General</span>
						</div>
						<div className="form-control bg-base-300 p-2">
							<label className="label cursor-pointer gap-2">
								<span className="label-text">Committed</span>
								<input
									type="checkbox"
									className="checkbox"
									{...methods.register("committed")}
								/>
							</label>
							<label className="label cursor-pointer gap-2">
								<span className="label-text">Status</span>
								<select
									className="select select-sm"
									{...methods.register("status")}
								>
									{Object.values(Status).map((status) => (
										<option key={status} value={status}>
											{status}
										</option>
									))}
								</select>
							</label>
							<label className="label cursor-pointer gap-2">
								<span className="label-text">Assigned Sex</span>
								<select
									className="select select-sm"
									{...methods.register("assigned_sex")}
								>
									{Object.values(Sex).map((sex) => (
										<option key={sex} value={sex}>
											{sex}
										</option>
									))}
								</select>
							</label>
							<label className="label cursor-pointer gap-2">
								<span className="label-text">School</span>
								<select
									className="select select-sm"
									{...methods.register("school")}
								>
									{Object.values(School).map((school) => (
										<option key={school} value={school}>
											{school}
										</option>
									))}
								</select>
							</label>
						</div>
					</div>
					<div className="flex flex-col">
						<div className="bg-base-200 px-2 py-1">
							<span className="text-xs font-bold uppercase">Dorm Life</span>
						</div>
						<div className="form-control bg-base-300 p-2">
							<label className="label cursor-pointer gap-2">
								<span className="label-text">Day Volume</span>
								<select
									className="select select-sm"
									{...methods.register("day_volume")}
								>
									{Object.values(Volume).map((volume) => (
										<option key={volume} value={volume}>
											{volume}
										</option>
									))}
								</select>
							</label>
							<label className="label cursor-pointer gap-2">
								<span className="label-text">Night Volume</span>
								<select
									className="select select-sm"
									{...methods.register("night_volume")}
								>
									{Object.values(Volume).map((volume) => (
										<option key={volume} value={volume}>
											{volume}
										</option>
									))}
								</select>
							</label>
							<label className="label cursor-pointer gap-2">
								<span className="label-text">Snore?</span>
								<input
									type="checkbox"
									className="checkbox"
									{...methods.register("snore")}
								/>
							</label>
							<label className="label cursor-pointer gap-2">
								<span className="label-text">Minimum Neatness</span>
								<input
									type="range"
									className="range range-sm"
									{...methods.register("minimum_neatness")}
								/>
							</label>
						</div>
					</div>
					<div className="flex flex-col">
						<div className="bg-base-200 px-2 py-1">
							<span className="text-xs font-bold uppercase">Social/Drugs</span>
						</div>
						<div className="form-control bg-base-300 p-2">
							<label className="label cursor-pointer gap-2">
								<span className="label-text">Minimum Social Energy Level</span>
								<input
									type="range"
									className="range range-sm"
									{...methods.register("minimum_social_energy_level")}
								/>
							</label>
							<label className="label cursor-pointer gap-2">
								<span className="label-text">Alcohol</span>
								<input
									type="checkbox"
									className="checkbox"
									{...methods.register("alcohol")}
								/>
							</label>
							<label className="label cursor-pointer gap-2">
								<span className="label-text">Drugs</span>
								<input
									type="checkbox"
									className="checkbox"
									{...methods.register("drugs")}
								/>
							</label>
						</div>
					</div>
					<div>
						<button type="submit" className="btn btn-primary btn-sm w-full">
							Apply
						</button>
					</div>
				</form>
			</Dialog>

			<>
				<div className="w-full text-3xl font-bold">Explore</div>
				<div className="w-full">
					<label className="input-group">
						<input
							type="text"
							className="input input-bordered w-full max-w-3xl"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search"
						/>
						<button
							type="button"
							onClick={() => setOpen(true)}
							className="btn btn-square btn-secondary"
						>
							<FaList className="h-6 w-6" />
						</button>
					</label>
				</div>
				<Profiles query={query} filter={filter} />
			</>
		</>
	);
}
