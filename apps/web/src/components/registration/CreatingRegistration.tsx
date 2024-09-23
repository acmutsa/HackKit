import { Bars, ThreeDots, ThreeCircles } from "react-loader-spinner";

export default function CreatingRegistration() {
	return (
		<main className="absolute bottom-0 left-0 z-10 flex min-h-screen w-screen flex-col items-center justify-center gap-y-20 bg-background">
			<h1 className="w-full text-center text-3xl font-black">
				Creating Your Registration...
			</h1>
			<ThreeCircles
				height="80"
				width="80"
				color="hsl(var(--primary))"
				ariaLabel="bars-loading"
				wrapperStyle={{}}
				wrapperClass=""
				visible={true}
			/>
		</main>
	);
}
