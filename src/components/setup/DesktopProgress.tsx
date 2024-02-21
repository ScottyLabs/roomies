import Link from "next/link";

type DesktopProgressProps = {
	step: number;
	values: readonly string[];
};

export const DesktopProgress: React.FC<DesktopProgressProps> = ({
	step,
	values,
}) => {
	return (
		<div className="fixed bottom-0 left-1/2 hidden w-full -translate-x-1/2 p-5 lg:block">
			<div className="flex w-full justify-center">
				<ul className="steps">
					{values.map((value, i) => (
						<li
							key={value}
							className={`step ${step >= i + 1 && "step-primary"}`}
						>
							<Link
								href={`/setup/${i + 1}`}
								className="link link-hover text-xs font-extralight"
							>
								{value}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};
