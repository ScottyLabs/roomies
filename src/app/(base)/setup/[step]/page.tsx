import { auth, SignIn } from "@clerk/nextjs";
import { SetupSteps } from "types/constants";
import { prisma } from "utils/db/client";
import Setup from "./Setup";

export default async function Page({ params }: { params: { step: string } }) {
	const session = auth();

	if (!session.userId) {
		SignIn({ redirectUrl: "/setup/1" });
		return;
	}

	const profile = await prisma.profile.findUnique({
		where: { accountId: session.userId },
	});

	if (profile) {
		SignIn({ redirectUrl: "/profile" });
		return;
	}

	const step = params.step;
	if (!+step || +step < 1 || +step > SetupSteps.length) {
		SignIn({ redirectUrl: "/setup/1" });
		return;
	}

	return <Setup step={+step} />;
}
