import type { FC, PropsWithChildren } from "react";

export const DashboardCard: FC<PropsWithChildren> = ({ children }) => (
	<div className="flex max-w-3xl flex-1 flex-col gap-5 rounded-lg bg-base-300 p-5">
		{children}
	</div>
);
