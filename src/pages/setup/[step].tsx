import { Transition } from "@headlessui/react";
import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";

import { prisma } from "../../server/db/client";

import BaseLayout from "../../components/BaseLayout";
import { DesktopProgress } from "../../components/SetupForm/DesktopProgress";
import { MobileProgress } from "../../components/SetupForm/MobileProgress";
import { SetupSteps } from "../../types/constants";

import { unstable_getServerSession } from "next-auth";
import { Setup1 } from "../../components/SetupForm/Setup1";
import { Setup10 } from "../../components/SetupForm/Setup10";
import { Setup11 } from "../../components/SetupForm/Setup11";
import { Setup12 } from "../../components/SetupForm/Setup12";
import { Setup13 } from "../../components/SetupForm/Setup13";
import { Setup14 } from "../../components/SetupForm/Setup14";
import { Setup15 } from "../../components/SetupForm/Setup15";
import { Setup2 } from "../../components/SetupForm/Setup2";
import { Setup3 } from "../../components/SetupForm/Setup3";
import { Setup4 } from "../../components/SetupForm/Setup4";
import { Setup5 } from "../../components/SetupForm/Setup5";
import { Setup6 } from "../../components/SetupForm/Setup6";
import { Setup7 } from "../../components/SetupForm/Setup7";
import { Setup8 } from "../../components/SetupForm/Setup8";
import { Setup9 } from "../../components/SetupForm/Setup9";
import { authOptions } from "../api/auth/[...nextauth]";

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

const Setup: NextPage<SetupProps> = ({ step }) => {
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
		<BaseLayout>
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
					leaveFrom="opacity-100 translate-x-0 scale-100 "
					leaveTo="-translate-x-48 scale-50 opacity-0"
				>
					<div className="m-4">{StepForms[formStep - 1]}</div>
				</Transition>
				<DesktopProgress values={SetupSteps} step={step} />
			</div>
		</BaseLayout>
	);
};

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

export default Setup;
