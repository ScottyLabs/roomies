/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Dialog, Transition } from "@headlessui/react";
import type { Media } from "@prisma/client";
import { Fragment, useState } from "react";
import { toast } from "react-hot-toast";
import {
	FaCircleNotch,
	FaDiscord,
	FaFacebook,
	FaInstagram,
	FaSnapchat,
	FaTwitter,
} from "react-icons/fa";
import { z } from "zod";
import { useZodForm } from "../../utils";
import { trpc } from "../../utils/trpc";
import type { ProviderName } from "./ConnectionItem";
import { ProviderNames } from "./ConnectionItem";

const Medias: Record<
	Media,
	{ icon: React.ReactNode; provider: ProviderName; media: Media }
> = {
	DISCORD: {
		icon: <FaDiscord className="h-10 w-10" />,
		provider: "Discord",
		media: "DISCORD",
	},
	INSTAGRAM: {
		icon: <FaInstagram className="h-10 w-10" />,
		provider: "Instagram",
		media: "INSTAGRAM",
	},
	SNAPCHAT: {
		icon: <FaSnapchat className="h-10 w-10" />,
		provider: "Snapchat",
		media: "SNAPCHAT",
	},
	TWITTER: {
		icon: <FaTwitter className="h-10 w-10" />,
		provider: "Twitter",
		media: "TWITTER",
	},
	FACEBOOK: {
		icon: <FaFacebook className="h-10 w-10" />,
		provider: "Facebook",
		media: "FACEBOOK",
	},
};

export const MediaList: React.FC = () => {
	const methods = useZodForm({
		schema: z.object({
			handle: z.string().min(3),
		}),
	});

	const [media, setMedia] = useState<Media | null>(null);
	const [open, setOpen] = useState(false);

	const context = trpc.useContext();

	const createConnection = trpc.connections.create.useMutation({
		onSuccess: async () => {
			toast.success("Connection created!");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const { data: connections, status } = trpc.connections.getAll.useQuery();

	if (status === "loading")
		return (
			<div>
				<button className="btn-disabled btn ">
					<FaCircleNotch className="h-10 w-10 animate-spin" />;
				</button>
			</div>
		);
	if (status === "error") return <div>Error</div>;

	return (
		<>
			<Transition appear show={open} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-10"
					onClose={() => setOpen(false)}
				>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-base-200 p-6 text-left align-middle shadow-xl transition-all">
									<Dialog.Title
										as="h3"
										className="text-lg font-medium leading-6"
									>
										Add a Connection
									</Dialog.Title>

									<form
										className="mt-2"
										onSubmit={methods.handleSubmit(async (result) => {
											await createConnection.mutateAsync({
												provider: media!,
												handle: result.handle,
											});
											context.connections.invalidate();
											methods.reset();
											setOpen(false);
										})}
									>
										<div>
											<label className="label flex-1 flex-col items-start gap-2">
												<span className="label-text">
													What is your {ProviderNames[media!]} handle?
												</span>
												<input
													className="input-bordered input w-full"
													type="text"
													{...methods.register("handle")}
												/>
											</label>
											<span className="text-xs text-error">
												{methods.formState.errors.handle?.message}
											</span>
										</div>
										<div className="modal-action">
											<button
												className="btn-ghost btn-sm btn"
												type="button"
												onClick={() => setOpen(false)}
											>
												Cancel
											</button>
											<button
												className="btn-secondary btn-sm btn"
												type="submit"
											>
												Submit
											</button>
										</div>
									</form>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>

			<div className="flex gap-3">
				{Object.values(Medias).map((data) => (
					<button
						key={data.provider}
						onClick={() => {
							setMedia(data.media);
							setOpen(true);
						}}
						disabled={connections.some((c) => c.provider === data.media)}
						className="btn-secondary tooltip btn-square btn flex cursor-pointer items-center justify-center"
						data-tip={data.provider}
					>
						{data.icon}
					</button>
				))}
			</div>
		</>
	);
};
