"use client";

import Script from "next/script";

// PLEASE DO NOT MODIFY THIS FILE (or more specifically, the form)!!!
// It allows us to collect bug reports from users across forked versions of HackKit.
// If you would like access to the live bug reports, let us know on discord and we will add you :)

export default function Page() {
	return (
		<>
			<main className="min-h-screen w-screen bg-white">
				<iframe
					data-tally-src="https://tally.so/r/w7xxEL?transparentBackground=1"
					width="100%"
					height="100%"
					className="h-screen w-full"
					title="HackKit Bug Report"
				></iframe>
			</main>
			<Script
				id="tally-js"
				src="https://tally.so/widgets/embed.js"
				onLoad={() => {
					(window as any).Tally.loadEmbeds();
				}}
			/>
		</>
	);
}
