"use client";

import { useEffect } from "react";
import { Gradient } from "@/lib/utils/client/gradient.js";

export default function GradientHero() {
	useEffect(() => {
		// Create your instance
		const gradient = new Gradient();

		// Call `initGradient` with the selector to your canvas
		gradient.initGradient("#gradient-canvas");
	}, []);

	return (
		<>
			<style>
				{`
            #gradient-canvas {
            width:100%;
            height:100%;
            }
         `}
			</style>
			<canvas
				className="-z-10 absolute top-0 left-0 bottom-0 right-0"
				id="gradient-canvas"
				data-transition-in
			/>
		</>
	);
}
