"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { trpcOptions } from "utils/trpc";

import { api } from "utils/trpc/api";

export const TrpcProvider: React.FC<{
	children: React.ReactNode;
	headers: Headers;
}> = (p) => {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() => api.createClient(trpcOptions(p.headers)));

	return (
		<api.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				{p.children}
			</QueryClientProvider>
		</api.Provider>
	);
};
