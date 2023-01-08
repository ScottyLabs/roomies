import { type NextPage } from "next";
import Link from "next/link";

import BaseLayout from "../components/BaseLayout";

const Home: NextPage = () => {
	return (
		<BaseLayout>
			<div className="fixed flex h-screen w-screen animate-pulse items-center justify-center font-mono text-[16em] tracking-tighter text-base-content text-primary-content/20 transition-all md:text-[25em]">
				404
			</div>
			<div className="z-10 flex h-screen w-screen flex-col items-center justify-center gap-8 backdrop-blur">
				<h1 className="text-5xl font-extrabold tracking-tight text-white transition-all md:text-[5rem]">
					Where <span className="text-primary">Am</span> I?
				</h1>
				<div>
					<Link href="/" className="btn-ghost btn rounded-full bg-white/10">
						Go Home
					</Link>
				</div>
			</div>
		</BaseLayout>
	);
};

export default Home;
