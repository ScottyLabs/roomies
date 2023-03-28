import { router } from "../trpc";
import { accountRouter } from "./account";
import { authRouter } from "./auth";
import { connectionsRouter } from "./connections";
import { groupRouter } from "./group";
import { invitationRouter } from "./invitations";
import { membershipRouter } from "./membership";
import { profileRouter } from "./profile";
import { userRouter } from "./user";

export const appRouter = router({
	auth: authRouter,
	user: userRouter,
	profile: profileRouter,
	account: accountRouter,
	connections: connectionsRouter,
	invitations: invitationRouter,
	groups: groupRouter,
	membership: membershipRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
