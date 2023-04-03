import { Transition } from "@headlessui/react";
import type { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useEffect, useState, type ReactElement } from "react";
import BaseLayout from "../../components/BaseLayout";
import { DesktopProgress } from "../../components/setup/DesktopProgress";
import { MobileProgress } from "../../components/setup/MobileProgress";
import { Setup1 } from "../../components/setup/Setup1";
import { Setup10 } from "../../components/setup/Setup10";
import { Setup11 } from "../../components/setup/Setup11";
import { Setup12 } from "../../components/setup/Setup12";
import { Setup13 } from "../../components/setup/Setup13";
import { Setup14 } from "../../components/setup/Setup14";
import { Setup15 } from "../../components/setup/Setup15";
import { Setup2 } from "../../components/setup/Setup2";
import { Setup3 } from "../../components/setup/Setup3";
import { Setup4 } from "../../components/setup/Setup4";
import { Setup5 } from "../../components/setup/Setup5";
import { Setup6 } from "../../components/setup/Setup6";
import { Setup7 } from "../../components/setup/Setup7";
import { Setup8 } from "../../components/setup/Setup8";
import { Setup9 } from "../../components/setup/Setup9";
import { prisma } from "../../server/db/client";
import { SetupSteps } from "../../types/constants";
import { authOptions } from "../api/auth/[...nextauth]";
import { type NextPageWithLayout } from "../_app";

const StepForms = [
	<Setup1 key={1} />,
	<Setup2 key={2} />,
	<Setup3 key={3} />,
	<Setup4 key={4} />,
	<Setup5 key={5} />,
	<Setup6 key={6} />,
	<Setup7 key={7} />,
	<Setup8 key={8} />,
	<Setup9 key={9} />,
	<Setup10 key={10} />,
	<Setup11 key={11} />,
	<Setup12 key={12} />,
	<Setup13 key={13} />,
	<Setup14 key={14} />,
	<Setup15 key={15} />,
] as const;

type SetupProps = {
	step: number;
};

const Setup: NextPageWithLayout<SetupProps> = ({ step }) => {
	const [isShowing, setIsShowing] = useState(false);
	const [formStep, setCurrentStep] = useState(step);

	useEffect(() => {
		setIsShowing(false);
		(async () => {
			await new Promise((resolve) => setTimeout(resolve, 500));
			setCurrentStep(step);
			setIsShowing(true);
		})();
	}, [step]);

	return (
		<div className="h-full w-full overflow-hidden">
			<MobileProgress
				value={step}
				max={SetupSteps.length}
				currentStep={SetupSteps[step - 1]}
				nextStep={SetupSteps[step]}
			/>
			<Transition
				show={isShowing}
				enter="transform transition duration-[400ms]"
				enterFrom="opacity-0 translate-x-48 scale-50"
				enterTo="opacity-100 translate-x-0 scale-100"
				leave="transform duration-200 transition ease-in-out"
				leaveFrom="opacity-100 translate-x-0 scale-100"
				leaveTo="-translate-x-48 scale-50 opacity-0"
			>
				<div className="m-4">{StepForms[formStep - 1]}</div>
			</Transition>
			<DesktopProgress values={SetupSteps} step={step} />
		</div>
	);
};

Setup.getLayout = function getLayout(page: ReactElement) {
	return <BaseLayout>{page}</BaseLayout>;
};

export default Setup;

export const getServerSideProps: GetServerSideProps<SetupProps> = async (
	ctx
) => {
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

	if (profile)
		return {
			redirect: {
				destination: "/profile",
				permanent: true,
			},
		};

	const step = ctx.params?.step as string;
	if (!+step || +step < 1 || +step > SetupSteps.length) {
		return {
			redirect: {
				destination: "/setup/1",
				permanent: true,
			},
		};
	}

	return {
		props: {
			step: +step,
		},
	};
};
