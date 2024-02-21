"use client";

import { api } from "utils/trpc";
import { ConnectionItem } from "./ConnectionItem";

export const ConnectionList: React.FC = () => {
	const [connections] = api.connections.getAll.useSuspenseQuery();

	return (
		<div className="flex flex-col gap-2">
			{connections.map((connection) => (
				<ConnectionItem key={connection.id} connection={connection} />
			))}
		</div>
	);
};
