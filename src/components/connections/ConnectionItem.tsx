import type { Connection, Media } from "@prisma/client";
import { DashboardCard } from "components/DashboardCard";
import { toast } from "react-hot-toast";
import {
	FaDiscord,
	FaFacebook,
	FaInstagram,
	FaSnapchat,
	FaTwitter,
} from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { api } from "utils/trpc";

export const ProviderIcons: Record<Media, React.ReactNode> = {
	DISCORD: <FaDiscord className="h-8 w-8" />,
	INSTAGRAM: <FaInstagram className="h-8 w-8" />,
	FACEBOOK: <FaFacebook className="h-8 w-8" />,
	SNAPCHAT: <FaSnapchat className="h-8 w-8" />,
	TWITTER: <FaTwitter className="h-8 w-8" />,
};

const ProviderName = [
	"Discord",
	"Instagram",
	"Facebook",
	"Snapchat",
	"Twitter",
] as const;
export type ProviderName = (typeof ProviderName)[number];

export const ProviderNames: Record<Media, ProviderName> = {
	DISCORD: "Discord",
	INSTAGRAM: "Instagram",
	FACEBOOK: "Facebook",
	SNAPCHAT: "Snapchat",
	TWITTER: "Twitter",
};

type ConnectionProps = {
	connection: Connection;
};

export const ConnectionItem: React.FC<ConnectionProps> = ({ connection }) => {
	const context = api.useContext();

	const removeConnection = api.connections.remove.useMutation({
		onSuccess: async () => {
			await context.connections.invalidate();
			toast.success("Connection removed");
		},
		onError: () => {
			toast.error("Failed to remove connection");
		},
	});

	return (
		<DashboardCard>
			<div className="flex w-72 items-center gap-2 rounded-md bg-base-200 p-2">
				<div className="flex flex-1 items-center gap-3">
					{ProviderIcons[connection.provider]}
					<div>
						<h5 className="font-thin leading-4">{connection.handle}</h5>
						<span className="text-xs font-bold">
							{ProviderNames[connection.provider]}
						</span>
					</div>
				</div>
				<div className="flex-0">
					<button
						className="btn btn-circle btn-ghost btn-sm"
						onClick={() => removeConnection.mutate({ id: connection.id })}
					>
						<ImCross />
					</button>
				</div>
			</div>
		</DashboardCard>
	);
};
