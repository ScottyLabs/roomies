import type { NextPage } from "next";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";
import { CustomToaster } from "../components/Toast";
import TransitionProvider from "../providers/TransitionProvider";
import "../styles/globals.css";
import { trpc } from "../utils/trpc";

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayoutAndSession = AppProps<{
	session: Session;
}> & {
	Component: NextPageWithLayout;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayoutAndSession) => {
	const getLayout = Component.getLayout ?? ((page) => page);

	return (
		<>
			<CustomToaster />
			<SessionProvider session={pageProps.session}>
				<TransitionProvider>
					{getLayout(<Component {...pageProps} />)}
				</TransitionProvider>
			</SessionProvider>
		</>
	);
};

export default trpc.withTRPC(MyApp);
