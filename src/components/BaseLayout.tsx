import Head from "next/head";

type BaseLayoutProps = React.PropsWithChildren;

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => (
	<>
		<Head>
			<title>Roomies!</title>
			<meta name="description" content="Find your dream roommate!" />
			<link rel="icon" href="/favicon.ico" />
		</Head>
		<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
			<div className="container flex w-full flex-col items-center justify-center gap-12 px-4 py-16">
				{children}
			</div>
		</main>
	</>
);

export default BaseLayout;
