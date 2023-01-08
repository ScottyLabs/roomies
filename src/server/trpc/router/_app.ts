import { router } from "../trpc";
import { accountRouter } from "./account";
import { authRouter } from "./auth";
import { profileRouter } from "./profile";
import { userRouter } from "./user";

export const appRouter = router({
	auth: authRouter,
	user: userRouter,
	profile: profileRouter,
	account: accountRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
