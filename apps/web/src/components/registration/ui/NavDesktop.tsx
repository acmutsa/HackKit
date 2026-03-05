"use client";

export default function NavDesktop({
	title,
	stepIndex,
	stepCount,
}: {
	title: string;
	stepIndex: number;
	stepCount: number;
}) {
	return (
		<div className="mb-4 flex items-end justify-between">
			<div>
				<p className="text-sm text-muted-foreground">
					{stepIndex + 1} / {stepCount}
				</p>
				<h2 className="text-xl font-semibold">{title}</h2>
			</div>
		</div>
	);
}