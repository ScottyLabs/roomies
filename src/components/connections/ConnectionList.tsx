import { FaCircleNotch } from "react-icons/fa";
import { trpc } from "../../utils/trpc";
import { ConnectionItem } from "./ConnectionItem";

export const ConnectionList: React.FC = () => {
	const { data: connections, status } = trpc.connections.getAll.useQuery();

	if (status === "loading") return <FaCircleNotch className="animate-spin" />;
	if (status === "error") return <div>Error</div>;

	return (
		<div className="flex flex-col gap-2">
			{connections.map((connection) => (
				<ConnectionItem key={connection.id} connection={connection} />
			))}
		</div>
	);
};
