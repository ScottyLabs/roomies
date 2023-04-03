import { signIn } from "next-auth/react";
import { type ReactElement } from "react";
import { FaGoogle } from "react-icons/fa";
import BaseLayout from "../../components/BaseLayout";
import { type NextPageWithLayout } from "../_app";

const SignIn: NextPageWithLayout = () => {
	return (
		<>
			<h1 className="text-5xl font-extrabold tracking-tight text-white">
				Please <span className="text-primary">Login</span> to view this page.
			</h1>
			<div className="flex flex-col items-center py-4">
				<button
					onClick={() =>
						signIn("google", {
							callbackUrl:
								new URLSearchParams(window.location.search).get(
									"callbackUrl"
								) ?? window.location.origin,
						})
					}
					className="btn-ghost btn mt-10 gap-3"
				>
					<FaGoogle />
					Sign in with Google
				</button>
			</div>
		</>
	);
};

SignIn.getLayout = function getLayout(page: ReactElement) {
	return <BaseLayout>{page}</BaseLayout>;
};

export default SignIn;
