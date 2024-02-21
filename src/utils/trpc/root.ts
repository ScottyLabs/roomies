import { accountRouter } from "./router/account";
import { authRouter } from "./router/auth";
import { connectionsRouter } from "./router/connections";
import { groupRouter } from "./router/group";
import { invitationRouter } from "./router/invitations";
import { membershipRouter } from "./router/membership";
import { profileRouter } from "./router/profile";
import { userRouter } from "./router/user";
import { router } from "./trpc";

export const appRouter = router({
	auth: authRouter,
	profiles: profileRouter,
	accounts: accountRouter,
	connections: connectionsRouter,
	invitations: invitationRouter,
	groups: groupRouter,
	memberships: membershipRouter,
	users: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
