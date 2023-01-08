type MobileProgressProps = {
	value: number;
	max: number;
	currentStep?: string;
	nextStep?: string;
};

export const MobileProgress: React.FC<MobileProgressProps> = ({
	value,
	max,
	currentStep,
	nextStep,
}) => {
	return (
		<div className="flex flex-col items-center">
			<div className="fixed top-0 left-1/2 flex w-full -translate-x-1/2 items-center gap-4 p-5 lg:hidden">
				<div className="flex-1">
					<div
						className="radial-progress text-primary"
						style={
							{
								"--value": (value / max) * 100,
								"--size": "4rem",
							} as React.CSSProperties
						}
					>
						<span className="font-bold">
							{((value / max) * 100).toFixed(0)} %
						</span>
					</div>
				</div>
				<div className="flex-0">
					<h1 className="text-xl font-bold uppercase">{currentStep}</h1>
					{nextStep && <span className="font-thin">Next: {nextStep}</span>}
				</div>
			</div>
		</div>
	);
};
