import {
	getFetch,
	loggerLink,
	unstable_httpBatchStreamLink,
	type CreateTRPCClientOptions,
} from "@trpc/client";
import SuperJSON from "superjson";
import type { AppRouter } from "./root";

function getBaseUrl() {
	if (typeof window !== "undefined")
		// browser should use relative path
		return "";
	if (process.env.VERCEL_URL)
		// reference for vercel.com
		return `https://${process.env.VERCEL_URL}`;
	// assume localhost
	return `http://localhost:${process.env.PORT ?? 3000}`;
}
// This is a subset of the options needed for a NextJS client
// So it will act as our generic React client options
export const trpcOptions: (
	headers?: Headers
) => CreateTRPCClientOptions<AppRouter> = (headers) => ({
	/**
	 * Transformer used for data de-serialization from the server.
	 *
	 * @see https://trpc.io/docs/data-transformers
	 */

	/**
	 * Links used to determine request flow from client to server.
	 *
	 * @see https://trpc.io/docs/links
	 */
	links: [
		loggerLink({
			enabled: (opts) =>
				process.env.NODE_ENV === "development" ||
				(opts.direction === "down" && opts.result instanceof Error),
		}),
		unstable_httpBatchStreamLink({
			// needs absolute URL in SSR
			url: `${getBaseUrl()}/api/trpc`,
			headers: () => {
				return Object.fromEntries(new Map(headers));
			},
			fetch(url, options) {
				// Ponyfill to send cookies with requests for cross origin auth
				const fetch = getFetch();
				return fetch(url, {
					...options,
					credentials: "include",
				});
			},
			transformer: SuperJSON,
		}),
	],
});
