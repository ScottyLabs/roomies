import type { Account } from "@prisma/client";
import type { BuiltInProviderType } from "next-auth/providers";
import { FaDiscord, FaGoogle, FaInstagram } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { trpc } from "../../utils/trpc";
import { DashboardCard } from "../MainLayout";

const Icons: Partial<Record<BuiltInProviderType, React.ReactNode>> = {
	google: <FaGoogle className="h-8 w-8" />,
	discord: <FaDiscord className="h-8 w-8" />,
	instagram: <FaInstagram className="h-8 w-8" />,
};

const ProviderNames: Partial<Record<BuiltInProviderType, string>> = {
	google: "Google",
	discord: "Discord",
	github: "Github",
};

type ConnectionProps = {
	account: Account;
};

export const Connection: React.FC<ConnectionProps> = ({ account }) => {
	const removeAccount = trpc.account.remove.useMutation();

	return (
		<div className="w-full">
			<DashboardCard>
				<div className="flex w-full items-center rounded-md bg-base-200 p-2">
					<div className="flex flex-1 items-center gap-3">
						{Icons[account.provider as BuiltInProviderType]}
						<div>
							<h5 className="font-thin leading-4">
								{account.providerAccountId}
							</h5>
							<span className="text-xs font-bold">
								{ProviderNames[account.provider as BuiltInProviderType]}
							</span>
						</div>
					</div>
					<div className="flex-0">
						<button
							className="btn-ghost btn-circle btn"
							onClick={() => removeAccount.mutate({ id: account.id })}
						>
							<ImCross />
						</button>
					</div>
				</div>
			</DashboardCard>
		</div>
	);
};
