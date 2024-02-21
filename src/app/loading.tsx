import { FaSpinner } from "react-icons/fa";

export default function Loading() {
	return (
		<main className="grid flex-1 place-items-center">
			<FaSpinner className="h-10 w-10 animate-spin" />
		</main>
	);
}
