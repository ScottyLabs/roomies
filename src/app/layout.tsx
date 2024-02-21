import { ClerkProvider } from "@clerk/nextjs";
import { CustomToaster } from "components/Toast";
import { TrpcProvider } from "components/TrpcProvider";
import type { Metadata } from "next";
import { headers } from "next/headers";
import TransitionProvider from "providers/TransitionProvider";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
	title: "Roomies",
	description: "Find your next roomie!",
};

export default function Layout({ children }: PropsWithChildren) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<CustomToaster />
				<ClerkProvider>
					<TrpcProvider headers={headers()}>
						<TransitionProvider>{children}</TransitionProvider>
					</TrpcProvider>
				</ClerkProvider>
			</body>
		</html>
	);
}
