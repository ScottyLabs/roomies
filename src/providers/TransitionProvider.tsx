import { Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import type { PropsWithChildren } from "react";
import { memo, useEffect, useState } from "react";
import { FaCircleNotch } from "react-icons/fa";

function TransitionProvider({ children }: PropsWithChildren) {
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const start = () => setLoading(true);
	const end = () => setLoading(false);

	useEffect(() => {
		router.events.on("routeChangeStart", start);
		router.events.on("routeChangeComplete", end);
		router.events.on("routeChangeError", end);
		return () => {
			router.events.off("routeChangeStart", start);
			router.events.off("routeChangeComplete", end);
			router.events.off("routeChangeError", end);
		};
	}, []);

	return (
		<>
			<Transition
				show={loading}
				enter="transition-all duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-all duration-300"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
				className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-base-100 bg-opacity-50 backdrop-blur"
			>
				<span className="animate-pulse text-xl font-bold">
					<FaCircleNotch className="h-10 w-10 animate-spin" />
				</span>
			</Transition>
			{children}
		</>
	);
}

export default memo(TransitionProvider);
