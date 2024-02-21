import { ClerkProvider } from "@clerk/nextjs";
import { CustomToaster } from "components/Toast";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { TrpcProvider } from "providers/TrpcProvider";
import type { PropsWithChildren } from "react";

import "styles/globals.css";

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
					<TrpcProvider headers={headers()}>{children}</TrpcProvider>
				</ClerkProvider>
			</body>
		</html>
	);
}
