"use client";

// Error components must be Client Components
import { useEffect } from "react";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<main className="flex flex-1 flex-col items-center justify-center gap-4">
			<h2>Something went wrong!</h2>
			<button className="button" onClick={() => reset()}>
				Try again
			</button>
		</main>
	);
}
