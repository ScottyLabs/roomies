import { auth, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { SetupSteps } from "types/constants";
import { prisma } from "utils/db/client";
import Setup from "./Setup";

export default async function Page({ params }: { params: { step: string } }) {
	const session = auth();

	if (!session.userId) {
		return redirectToSignIn({ returnBackUrl: "/setup/1" });
	}

	const profile = await prisma.profile.findUnique({
		where: { accountId: session.userId ?? undefined },
	});

	if (profile) {
		redirect("/profile");
	}

	const step = params.step;
	if (+step < 1 || +step > SetupSteps.length) {
		return redirectToSignIn({ returnBackUrl: "/setup/1" });
	}

	return <Setup step={+step} />;
}
