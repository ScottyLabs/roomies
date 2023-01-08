export { default } from "next-auth/middleware";

export const config = {
	matcher: ["/profile", "/connections", "/explore", "/setup/:path*"],
};
