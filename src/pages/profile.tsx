import {
	Bathroom,
	Dorm,
	School,
	Sex,
	ShowerTime,
	Status,
	Volume,
} from "@prisma/client";
import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { FaCircleNotch, FaInfoCircle } from "react-icons/fa";
import MainLayout, { DashboardCard } from "../components/MainLayout";
import { ProfileUpdateSchema } from "../server/common/schemas";
import { prisma } from "../server/db/client";
import { ProfileDescriptions, ProfileLabels } from "../types/constants";
import { useZodForm } from "../utils";
import { trpc } from "../utils/trpc";
import { authOptions } from "./api/auth/[...nextauth]";

const Profile: NextPage = () => {
	const { data: session } = useSession();
	const { data: profile } = trpc.profile.getCurrent.useQuery();
	const context = trpc.useContext();

	const profileMutation = trpc.profile.update.useMutation({
		onSuccess: async () => {
			await context.profile.invalidate();
			toast.success("Profile updated");
		},
	});

	const methods = useZodForm({
		schema: ProfileUpdateSchema,
	});

	useEffect(() => {
		if (!profile) return;
		methods.reset(profile);
	}, [profile]);

	if (!session || !profile)
		return (
			<MainLayout>
				<FaCircleNotch className="animate-spin" />
			</MainLayout>
		);

	return (
		<MainLayout>
			<div className="w-full text-3xl font-bold">Profile</div>
			<DashboardCard>
				<div className="flex items-center gap-5">
					<div className="avatar">
						<div className="mask mask-squircle w-20">
							<Image
								src={session.user.image ?? ""}
								alt="profile"
								width={128}
								height={128}
							/>
						</div>
					</div>
					<div>
						<h3 className="text-2xl font-bold">{session.user.name}</h3>
						<h5 className="font-thin">
							Carnegie Mellon University @ <span>{profile.year}</span>
						</h5>
					</div>
				</div>
				<form
					className="form-control m-2 gap-5"
					onSubmit={methods.handleSubmit(async (values) => {
						await profileMutation.mutateAsync(values);
						methods.reset();
					})}
				>
					<div className="divider" />
					<h4 className="text-lg font-bold">General</h4>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">{ProfileLabels.year}</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.year}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.year?.message}
									</span>
								</p>
							</div>
							<input
								type="number"
								className="input"
								{...methods.register("year")}
							/>
						</div>
					</div>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">{ProfileLabels.committed}</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.committed}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.committed?.message}
									</span>
								</p>
							</div>
							<input
								type="checkbox"
								className="toggle"
								{...methods.register("committed")}
							/>
						</div>
					</div>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">{ProfileLabels.status}</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.status}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.status?.message}
									</span>
								</p>
							</div>
							<select className="select" {...methods.register("status")}>
								{Object.values(Status).map((status) => (
									<option key={status} value={status}>
										{status}
									</option>
								))}
							</select>
						</div>
					</div>
					<div className="divider" />
					<h4 className="text-lg font-bold">Identity</h4>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">
									{ProfileLabels.assigned_sex}
								</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.assigned_sex}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.assigned_sex?.message}
									</span>
								</p>
							</div>
							<select
								className="select select-multiple"
								multiple
								{...methods.register("assigned_sex")}
							>
								{Object.values(Sex).map((sex) => (
									<option key={sex} value={sex}>
										{sex}
									</option>
								))}
							</select>
						</div>
					</div>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">
									{ProfileLabels.sexual_orientation}
								</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.sexual_orientation}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.sexual_orientation?.message}
									</span>
								</p>
							</div>
							<input
								type="text"
								className="input"
								{...methods.register("sexual_orientation")}
							/>
						</div>
					</div>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">{ProfileLabels.pronouns}</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.pronouns}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.pronouns?.message}
									</span>
								</p>
							</div>
							<input
								type="text"
								className="input"
								{...methods.register("pronouns")}
							/>
						</div>
					</div>
					<div className="divider" />
					<h4 className="text-lg font-bold">Personal Information</h4>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">{ProfileLabels.location}</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.location}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.location?.message}
									</span>
								</p>
							</div>
							<input
								type="text"
								className="input"
								{...methods.register("location")}
							/>
						</div>
					</div>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">
									{ProfileLabels.health_concerns}
								</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.health_concerns}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.health_concerns?.message}
									</span>
								</p>
							</div>
							<input
								type="text"
								className="input"
								{...methods.register("health_concerns")}
							/>
						</div>
					</div>
					<div className="divider" />
					<h4 className="text-lg font-bold">School Preferences</h4>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">
									{ProfileLabels.health_concerns}
								</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.health_concerns}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.health_concerns?.message}
									</span>
								</p>
							</div>
							<input
								type="text"
								className="input"
								{...methods.register("health_concerns")}
							/>
						</div>
					</div>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">{ProfileLabels.schools}</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.schools}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.schools?.message}
									</span>
								</p>
							</div>
							<select
								className="select select-multiple"
								multiple
								{...methods.register("schools")}
							>
								{Object.values(School).map((school) => (
									<option key={school} value={school}>
										{school}
									</option>
								))}
							</select>
						</div>
					</div>
					<div className="divider" />
					<h4 className="text-lg font-bold">Roommate Preferences</h4>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">
									{ProfileLabels.roommate_preferred_gender}
								</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.roommate_preferred_gender}{" "}
									<span className="text-xs text-red-700">
										{
											methods.formState.errors.roommate_preferred_gender
												?.message
										}
									</span>
								</p>
							</div>
							<input
								type="text"
								className="input"
								{...methods.register("roommate_preferred_gender")}
							/>
						</div>
					</div>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">
									{ProfileLabels.roommate_preferred_schools}
								</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.roommate_preferred_schools}{" "}
									<span className="text-xs text-red-700">
										{
											methods.formState.errors.roommate_preferred_schools
												?.message
										}
									</span>
								</p>
							</div>
							<select
								className="select select-multiple"
								multiple
								{...methods.register("roommate_preferred_schools")}
							>
								{Object.values(School).map((school) => (
									<option key={school} value={school}>
										{school}
									</option>
								))}
							</select>
						</div>
					</div>
					<div className="divider" />
					<h4 className="text-lg font-bold">Dorm Topics</h4>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">
									{ProfileLabels.preferred_dorm}
								</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.preferred_dorm}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.preferred_dorm?.message}
									</span>
								</p>
							</div>
							<select
								className="select select-multiple"
								multiple
								{...methods.register("preferred_dorm")}
							>
								{Object.values(Dorm).map((dorm) => (
									<option key={dorm} value={dorm}>
										{dorm}
									</option>
								))}
							</select>
						</div>
					</div>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">
									{ProfileLabels.bathroom_preference}
								</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.bathroom_preference}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.bathroom_preference?.message}
									</span>
								</p>
							</div>
							<select
								className="select select-multiple"
								multiple
								{...methods.register("bathroom_preference")}
							>
								{Object.values(Bathroom).map((bathroom) => (
									<option key={bathroom} value={bathroom}>
										{bathroom}
									</option>
								))}
							</select>
						</div>
					</div>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">{ProfileLabels.quiet_dorm}</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.quiet_dorm}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.quiet_dorm?.message}
									</span>
								</p>
							</div>
							<input
								type="checkbox"
								className="toggle"
								{...methods.register("quiet_dorm")}
							/>
						</div>
					</div>
					<div className="divider" />
					<h4 className="text-lg font-bold">Mornings and Evenings</h4>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">{ProfileLabels.wake}</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.wake}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.wake?.message}
									</span>
								</p>
							</div>
							<input
								type="time"
								className="input"
								{...methods.register("wake")}
							/>
						</div>
					</div>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">
									{ProfileLabels.time_to_ready}
								</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.time_to_ready}{" "}
								</p>
							</div>
							<input
								type="number"
								step={1}
								className="input"
								{...methods.register("time_to_ready")}
							/>
						</div>
						<span className="float-right mt-1 text-xs text-red-700">
							{methods.formState.errors.time_to_ready?.message}
						</span>
					</div>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">{ProfileLabels.day_volume}</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.day_volume}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.day_volume?.message}
									</span>
								</p>
							</div>
							<select
								className="select select-multiple"
								multiple
								{...methods.register("day_volume")}
							>
								{Object.values(Volume).map((volume) => (
									<option key={volume} value={volume}>
										{volume}
									</option>
								))}
							</select>
						</div>
					</div>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">{ProfileLabels.sleep}</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.sleep}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.sleep?.message}
									</span>
								</p>
							</div>
							<input
								type="text"
								className="input"
								{...methods.register("sleep")}
							/>
						</div>
					</div>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">{ProfileLabels.sleep_needs}</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.sleep_needs}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.sleep_needs?.message}
									</span>
								</p>
							</div>
							<input
								type="text"
								className="input"
								{...methods.register("sleep_needs")}
							/>
						</div>
					</div>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">
									{ProfileLabels.night_volume}
								</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.night_volume}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.night_volume?.message}
									</span>
								</p>
							</div>
							<select
								className="select select-multiple"
								multiple
								{...methods.register("night_volume")}
							>
								{Object.values(Volume).map((volume) => (
									<option key={volume} value={volume}>
										{volume}
									</option>
								))}
							</select>
						</div>
					</div>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">{ProfileLabels.snore}</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.snore}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.snore?.message}
									</span>
								</p>
							</div>
							<input
								type="checkbox"
								className="toggle"
								{...methods.register("snore")}
							/>
						</div>
					</div>
					<div className="divider" />
					<h4 className="text-lg font-bold">Daily Life</h4>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">{ProfileLabels.shower_time}</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.shower_time}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.shower_time?.message}
									</span>
								</p>
							</div>
							<select
								className="select select-multiple"
								multiple
								{...methods.register("shower_time")}
							>
								{Object.values(ShowerTime).map((showerTime) => (
									<option key={showerTime} value={showerTime}>
										{showerTime}
									</option>
								))}
							</select>
						</div>
					</div>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">
									{ProfileLabels.study_preferences}
								</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.study_preferences}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.study_preferences?.message}
									</span>
								</p>
							</div>
							<input
								type="text"
								className="input"
								{...methods.register("study_preferences")}
							/>
						</div>
					</div>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">{ProfileLabels.neatness}</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.neatness}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.neatness?.message}
									</span>
								</p>
							</div>
							<input
								type="range"
								className="range max-w-xs"
								{...methods.register("neatness")}
							/>
						</div>
					</div>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">
									{ProfileLabels.social_energy_level}
								</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.social_energy_level}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.social_energy_level?.message}
									</span>
								</p>
							</div>
							<input
								type="range"
								className="range max-w-xs"
								{...methods.register("social_energy_level")}
							/>
						</div>
					</div>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">{ProfileLabels.alcohol}</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.alcohol}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.alcohol?.message}
									</span>
								</p>
							</div>
							<input
								type="checkbox"
								className="toggle"
								{...methods.register("drugs")}
							/>
						</div>
					</div>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">{ProfileLabels.drugs}</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.drugs}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.drugs?.message}
									</span>
								</p>
							</div>
							<input
								type="checkbox"
								className="toggle"
								{...methods.register("drugs")}
							/>
						</div>
					</div>
					<div className="divider" />
					<h4 className="text-lg font-bold">Supplementary Information</h4>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">
									{ProfileLabels.political_spectrum}
								</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.political_spectrum}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.political_spectrum?.message}
									</span>
								</p>
							</div>
							<input
								type="text"
								className="input"
								{...methods.register("political_spectrum")}
							/>
						</div>
					</div>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">{ProfileLabels.religion}</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.religion}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.religion?.message}
									</span>
								</p>
							</div>
							<input
								type="text"
								className="input"
								{...methods.register("religion")}
							/>
						</div>
					</div>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">{ProfileLabels.music}</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.music}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.music?.message}
									</span>
								</p>
							</div>
							<input
								type="text"
								className="input"
								{...methods.register("music")}
							/>
						</div>
					</div>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">{ProfileLabels.aesthetic}</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.aesthetic}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.aesthetic?.message}
									</span>
								</p>
							</div>
							<input
								type="text"
								className="input"
								{...methods.register("aesthetic")}
							/>
						</div>
					</div>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">{ProfileLabels.hobbies}</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.hobbies}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.hobbies?.message}
									</span>
								</p>
							</div>
							<input
								type="text"
								className="input"
								{...methods.register("hobbies")}
							/>
						</div>
					</div>

					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">{ProfileLabels.fun_fact}</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.fun_fact}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.fun_fact?.message}
									</span>
								</p>
							</div>
							<input
								type="text"
								className="input"
								{...methods.register("fun_fact")}
							/>
						</div>
					</div>
					<div className="mx-2">
						<div className="flex items-center justify-between gap-2">
							<div>
								<label className="font-bold">{ProfileLabels.notes}</label>
								<p className="text-sm font-thin">
									{ProfileDescriptions.notes}{" "}
									<span className="text-xs text-red-700">
										{methods.formState.errors.notes?.message}
									</span>
								</p>
							</div>
							<textarea
								className="textarea-bordered textarea"
								{...methods.register("notes")}
							/>
						</div>
					</div>
					{methods.formState.isDirty && (
						<div className="toast-center toast z-50 w-3/4 max-w-lg">
							<div className="alert mx-2 h-16 flex-row border-4 border-base-100 bg-opacity-50 shadow-lg backdrop-blur">
								<div>
									<FaInfoCircle />
									<span>Save your changes?</span>
								</div>
								{profileMutation.isLoading ? (
									<FaCircleNotch className="animate-spin" />
								) : (
									<div className="flex-none">
										<button
											className="btn-ghost btn-sm btn"
											onClick={() => methods.reset()}
										>
											Deny
										</button>
										<button className="btn-primary btn-sm btn" type="submit">
											Accept
										</button>
									</div>
								)}
							</div>
						</div>
					)}
				</form>
			</DashboardCard>
		</MainLayout>
	);
};

export default Profile;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await unstable_getServerSession(
		context.req,
		context.res,
		authOptions
	);

	const profile = await prisma.profile.findUnique({
		where: { userId: session?.user.id },
	});

	if (!profile) {
		return {
			redirect: {
				destination: "/setup/1",
				permanent: true,
			},
		};
	}

	return { props: {} };
};
