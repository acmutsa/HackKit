"use client";

import Tilt from "react-parallax-tilt";
import type { ReactNode } from "react";

export default function TiltWrapper({ children }: { children: ReactNode }) {
	const doTilt: boolean =
		typeof window !== "undefined" && window
			? (window.visualViewport?.width as number) >= 600
			: false;

	return (
		<div>
			<Tilt
				className="parallax-effect-img"
				perspective={1000}
				gyroscope={false}
				tiltReverse={true}
				glareEnable={doTilt}
				glareMaxOpacity={0.2}
				glareColor="hsl(var(--hackathon-primary))"
				glarePosition="all"
				glareBorderRadius="1.5rem"
				tiltEnable={doTilt}
			>
				{children}
			</Tilt>
		</div>
	);
}
