import { Bars } from "react-loader-spinner";

export default function CreatingRegistration() {
	return (
		<main className="flex flex-col items-center justify-center min-h-screen w-screen absolute bottom-0 left-0 z-10 bg-background gap-y-20">
			<h1 className="font-black text-3xl">Creating Your Registration!</h1>
			<Bars
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
