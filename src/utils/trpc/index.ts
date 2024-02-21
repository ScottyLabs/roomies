import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "./root";

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
type RouterOutputs = inferRouterOutputs<AppRouter>;

export { api } from "./api";
export { trpcOptions } from "./options";
export type { AppRouter, RouterInputs, RouterOutputs };
