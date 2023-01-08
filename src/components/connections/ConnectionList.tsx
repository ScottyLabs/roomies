import { FaCircleNotch } from "react-icons/fa";
import { trpc } from "../../utils/trpc";
import { Connection } from "./Connection";

export const ConnectionList: React.FC = () => {
	const { data: accounts, isLoading, isError } = trpc.account.getAll.useQuery();

	if (isLoading) return <FaCircleNotch className="animate-spin" />;
	if (isError) return <div>Something went wrong</div>;

	return (
		<>
			{accounts
				.filter((account) => account.provider !== "google")
				.map((account) => (
					<Connection key={account.id} account={account} />
				))}
		</>
	);
};
