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
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { FaCircleNotch, FaInfoCircle } from "react-icons/fa";
import MainLayout, { DashboardCard } from "../components/MainLayout";
import ProfileField from "../components/ProfileField";
import { ProfileUpdateSchema } from "../server/common/schemas";
import { prisma } from "../server/db/client";
import { useZodForm } from "../utils";
import { trpc } from "../utils/trpc";
import { authOptions } from "./api/auth/[...nextauth]";

const Profile: NextPage = () => {
	const { data: session } = useSession({ required: true });
	const { data: profile } = trpc.profile.getCurrent.useQuery();
	const context = trpc.useContext();

	const profileMutation = trpc.profile.update.useMutation({
		onSuccess: async () => context.profile.invalidate(),
	});

	const methods = useZodForm({
		schema: ProfileUpdateSchema,
	});

	const router = useRouter();

	const deleteAccount = trpc.user.remove.useMutation({
		onSuccess: async () => {
			await router.push("/");
			signOut();
			toast.success("Account deleted");
		},
		onError: () => {
			toast.error("Failed to delete account");
		},
	});

	useEffect(() => {
		if (!profile) return;
		methods.reset(profile);
	}, [profile, methods]);

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
						await toast.promise(profileMutation.mutateAsync(values), {
							loading: "Saving...",
							success: <b>Profile saved!</b>,
							error: <b>Could not save.</b>,
						});
					})}
				>
					<div className="divider" />
					<h4 className="text-lg font-bold">General Information</h4>
					<ProfileField methods={methods} prop="year">
						<input
							type="number"
							className="input w-full"
							{...methods.register("year")}
						/>
					</ProfileField>
					<ProfileField methods={methods} prop="committed" transform={false}>
						<input
							type="checkbox"
							className="toggle"
							{...methods.register("committed")}
						/>
					</ProfileField>
					<ProfileField methods={methods} prop="status">
						<select className="select w-full" {...methods.register("status")}>
							{Object.values(Status).map((status) => (
								<option key={status} value={status}>
									{status}
								</option>
							))}
						</select>
					</ProfileField>
					<div className="divider" />
					<h4 className="text-lg font-bold">Identity</h4>
					<ProfileField methods={methods} prop="assigned_sex">
						<select
							className="select w-full"
							{...methods.register("assigned_sex")}
						>
							{Object.values(Sex).map((sex) => (
								<option key={sex} value={sex}>
									{sex}
								</option>
							))}
						</select>
					</ProfileField>
					<ProfileField methods={methods} prop="sexual_orientation">
						<input
							type="text"
							className="input w-full"
							{...methods.register("sexual_orientation")}
						/>
					</ProfileField>
					<ProfileField methods={methods} prop="pronouns">
						<input
							type="text"
							className="input w-full"
							{...methods.register("pronouns")}
						/>
					</ProfileField>
					<div className="divider" />
					<h4 className="text-lg font-bold">Personal Information</h4>
					<ProfileField methods={methods} prop="location">
						<input
							type="text"
							className="input w-full"
							{...methods.register("location")}
						/>
					</ProfileField>
					<ProfileField methods={methods} prop="health_concerns">
						<input
							type="text"
							className="input w-full"
							{...methods.register("health_concerns")}
						/>
					</ProfileField>
					<div className="divider" />
					<h4 className="text-lg font-bold">School Attending</h4>
					<ProfileField methods={methods} prop="school">
						<select className="select w-full" {...methods.register("school")}>
							{Object.values(School).map((school) => (
								<option key={school} value={school}>
									{school}
								</option>
							))}
						</select>
					</ProfileField>
					<div className="divider" />
					<h4 className="text-lg font-bold">Roommate Preferences</h4>
					<ProfileField methods={methods} prop="roommate_preferred_gender">
						<input
							type="text"
							className="input w-full"
							{...methods.register("roommate_preferred_gender")}
						/>
					</ProfileField>
					<ProfileField methods={methods} prop="roommate_preferred_schools">
						<select
							className="select w-full"
							multiple
							{...methods.register("roommate_preferred_schools")}
						>
							{Object.values(School).map((school) => (
								<option key={school} value={school}>
									{school}
								</option>
							))}
						</select>
					</ProfileField>
					<div className="divider" />
					<h4 className="text-lg font-bold">Dorm Topics</h4>
					<ProfileField methods={methods} prop="preferred_dorm">
						<select
							className="select w-full"
							multiple
							{...methods.register("preferred_dorm")}
						>
							{Object.values(Dorm).map((dorm) => (
								<option key={dorm} value={dorm}>
									{dorm}
								</option>
							))}
						</select>
					</ProfileField>
					<ProfileField methods={methods} prop="bathroom_preference">
						<select
							className="select w-full"
							multiple
							{...methods.register("bathroom_preference")}
						>
							{Object.values(Bathroom).map((bathroom) => (
								<option key={bathroom} value={bathroom}>
									{bathroom}
								</option>
							))}
						</select>
					</ProfileField>
					<ProfileField methods={methods} prop="quiet_dorm" transform={false}>
						<input
							type="checkbox"
							className="toggle"
							{...methods.register("quiet_dorm")}
						/>
					</ProfileField>
					<div className="divider" />
					<h4 className="text-lg font-bold">Day Time</h4>
					<ProfileField methods={methods} prop="wake">
						<input
							type="time"
							className="input w-full"
							{...methods.register("wake")}
						/>
					</ProfileField>
					<ProfileField methods={methods} prop="time_to_ready">
						<input
							type="number"
							step={1}
							className="input w-full"
							{...methods.register("time_to_ready")}
						/>
					</ProfileField>
					<ProfileField methods={methods} prop="day_volume">
						<select
							className="select w-full"
							{...methods.register("day_volume")}
						>
							{Object.values(Volume).map((volume) => (
								<option key={volume} value={volume}>
									{volume}
								</option>
							))}
						</select>
					</ProfileField>
					<div className="divider" />
					<h4 className="text-lg font-bold">Night Time</h4>
					<ProfileField methods={methods} prop="sleep">
						<input
							type="time"
							className="input w-full"
							{...methods.register("sleep")}
						/>
					</ProfileField>
					<ProfileField methods={methods} prop="sleep_needs">
						<input
							type="text"
							className="input w-full"
							{...methods.register("sleep_needs")}
						/>
					</ProfileField>
					<ProfileField methods={methods} prop="night_volume">
						<select
							className="select w-full"
							{...methods.register("night_volume")}
						>
							{Object.values(Volume).map((volume) => (
								<option key={volume} value={volume}>
									{volume}
								</option>
							))}
						</select>
					</ProfileField>
					<ProfileField methods={methods} prop="snore" transform={false}>
						<input
							type="checkbox"
							className="toggle"
							{...methods.register("snore")}
						/>
					</ProfileField>
					<div className="divider" />
					<h4 className="text-lg font-bold">Habits</h4>
					<ProfileField methods={methods} prop="shower_time">
						<select
							className="select w-full"
							{...methods.register("shower_time")}
						>
							{Object.values(ShowerTime).map((showerTime) => (
								<option key={showerTime} value={showerTime}>
									{showerTime}
								</option>
							))}
						</select>
					</ProfileField>
					<ProfileField methods={methods} prop="study_preferences">
						<input
							type="text"
							className="input w-full"
							{...methods.register("study_preferences")}
						/>
					</ProfileField>
					<ProfileField methods={methods} prop="neatness">
						<input
							type="range"
							className="range range-xs w-full"
							{...methods.register("neatness")}
						/>
					</ProfileField>
					<ProfileField methods={methods} prop="social_energy_level">
						<input
							type="range"
							className="range range-xs w-full"
							{...methods.register("social_energy_level")}
						/>
					</ProfileField>
					<ProfileField methods={methods} prop="alcohol" transform={false}>
						<input
							type="checkbox"
							className="checkbox"
							{...methods.register("alcohol")}
						/>
					</ProfileField>
					<ProfileField methods={methods} prop="drugs" transform={false}>
						<input
							type="checkbox"
							className="checkbox"
							{...methods.register("drugs")}
						/>
					</ProfileField>
					<ProfileField methods={methods} prop="parties">
						<input
							type="text"
							className="input w-full"
							{...methods.register("parties")}
						/>
					</ProfileField>
					<div className="divider" />
					<h4 className="text-lg font-bold">Artistic Views</h4>
					<ProfileField methods={methods} prop="music">
						<input
							type="text"
							className="input w-full"
							{...methods.register("music")}
						/>
					</ProfileField>
					<ProfileField methods={methods} prop="hobbies">
						<input
							type="text"
							className="input w-full"
							{...methods.register("hobbies")}
						/>
					</ProfileField>
					<ProfileField methods={methods} prop="aesthetic">
						<input
							type="text"
							className="input w-full"
							{...methods.register("aesthetic")}
						/>
					</ProfileField>
					<div className="divider" />
					<h4 className="text-lg font-bold">Supplementary Information</h4>
					<ProfileField methods={methods} prop="political_spectrum">
						<input
							type="text"
							className="input w-full"
							{...methods.register("political_spectrum")}
						/>
					</ProfileField>
					<ProfileField methods={methods} prop="religion">
						<input
							type="text"
							className="input w-full"
							{...methods.register("religion")}
						/>
					</ProfileField>
					<ProfileField methods={methods} prop="personality_test">
						<input
							type="text"
							className="input w-full"
							{...methods.register("personality_test")}
						/>
					</ProfileField>
					<div className="divider" />
					<h4 className="text-lg font-bold">Extras</h4>
					<ProfileField methods={methods} prop="fun_fact">
						<input
							type="text"
							className="input w-full"
							{...methods.register("fun_fact")}
						/>
					</ProfileField>
					<ProfileField methods={methods} prop="notes">
						<textarea
							className="textarea w-full"
							{...methods.register("notes")}
						/>
					</ProfileField>
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
										<button
											className="btn-primary btn-sm btn"
											type="submit"
											disabled={
												!methods.formState.isValid &&
												methods.formState.submitCount > 0
											}
										>
											Accept
										</button>
									</div>
								)}
							</div>
						</div>
					)}
				</form>
				<div>
					<label htmlFor="delete-account" className="btn-error btn float-left">
						Delete Account
					</label>

					<input type="checkbox" id="delete-account" className="modal-toggle" />
					<div className="modal">
						<div className="modal-box">
							<h3 className="text-lg font-bold">Delete your account</h3>
							<p className="py-4">
								When you delete your account, all of your data will be
								permanently deleted. This action cannot be undone.
							</p>
							<p>Are you sure you want to delete your account?</p>
							<div className="modal-action">
								<label htmlFor="delete-account" className="btn-ghost btn">
									No
								</label>
								<label
									htmlFor="delete-account"
									onClick={() => deleteAccount.mutate({ id: session.user.id })}
									className="btn-error btn"
								>
									Yes, Delete My Account
								</label>
							</div>
						</div>
					</div>
				</div>
			</DashboardCard>
		</MainLayout>
	);
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const session = await unstable_getServerSession(
		ctx.req,
		ctx.res,
		authOptions
	);

	const profile = await prisma.profile.findUnique({
		where: {
			userId: session?.user.id,
		},
	});

	if (!profile)
		return {
			redirect: {
				destination: "/setup/1",
				permanent: true,
			},
		};

	return {
		props: {},
	};
};

export default Profile;
