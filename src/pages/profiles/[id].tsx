import { useRouter } from "next/router";
import MainLayout from "../../components/MainLayout";
import { trpc } from "../../utils/trpc";

const ProfilePage = () => {
	const router = useRouter();
	const { id } = router.query;

	if (typeof id !== "string") return null;

	const { data: profile, status } = trpc.profile.byId.useQuery({ id });

	if (status === "loading") return <div>Loading...</div>;
	if (status === "error") return <div>Error</div>;

	if (!profile) return <div>Profile not found</div>;

	return (
		<MainLayout>
			<div className="w-full text-3xl font-bold">{profile.user.name}</div>
			<div className="mockup-code w-full p-4">
				{JSON.stringify(profile, undefined, "\t")}
			</div>
		</MainLayout>
	);
};

export default ProfilePage;
