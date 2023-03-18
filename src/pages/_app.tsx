import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { CustomToaster } from "../components/Toast";
import TransitionProvider from "../providers/TransitionProvider";
import "../styles/globals.css";
import { trpc } from "../utils/trpc";

const MyApp: AppType<{ session: Session | null }> = ({
	Component,
	pageProps: { session, ...pageProps },
}) => {
	return (
		<>
			<CustomToaster />
			<SessionProvider session={session}>
				<TransitionProvider>
					<Component {...pageProps} />
				</TransitionProvider>
			</SessionProvider>
		</>
	);
};

export default trpc.withTRPC(MyApp);
