import type { NextPage } from "next";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
import BaseLayout from "../../components/BaseLayout";

const SignIn: NextPage = () => {
	return (
		<BaseLayout>
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
		</BaseLayout>
	);
};

export default SignIn;
