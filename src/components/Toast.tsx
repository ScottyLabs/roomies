import { Transition } from "@headlessui/react";
import { Toaster, ToastIcon } from "react-hot-toast";

export const CustomToaster = () => {
	return (
		<Toaster>
			{(t) => (
				<Transition
					appear
					show={t.visible}
					className="flex transform items-center gap-2 rounded bg-base-300 p-4 shadow-lg"
					enter="transition-all duration-150"
					enterFrom="opacity-0 scale-50"
					enterTo="opacity-100 scale-100"
					leave="transition-all duration-150"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-75"
				>
					<>
						<ToastIcon toast={t} />
						{t.message}
					</>
				</Transition>
			)}
		</Toaster>
	);
};
