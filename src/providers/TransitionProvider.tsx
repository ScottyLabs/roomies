import { Transition } from "@headlessui/react";
import { Router } from "next/router";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { FaCircleNotch } from "react-icons/fa";

export default function TransitionProvider({ children }: PropsWithChildren) {
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		const start = () => {
			console.log("start");
			setLoading(true);
		};
		const end = () => {
			console.log("finished");
			setLoading(false);
		};
		Router.events.on("routeChangeStart", start);
		Router.events.on("routeChangeComplete", end);
		Router.events.on("routeChangeError", end);
		return () => {
			Router.events.off("routeChangeStart", start);
			Router.events.off("routeChangeComplete", end);
			Router.events.off("routeChangeError", end);
		};
	}, []);

	return (
		<>
			<Transition
				appear
				show={loading}
				enter="transition-all duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-all duration-300"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
				className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-base-100 bg-opacity-50 backdrop-blur"
			>
				<span className="fixed z-50 animate-pulse text-xl font-bold">
					<FaCircleNotch className="h-10 w-10 animate-spin" />
				</span>
			</Transition>
			{children}
		</>
	);
}
