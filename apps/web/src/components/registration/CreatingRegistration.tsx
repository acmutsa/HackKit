import { ThreeCircles } from "react-loader-spinner";
import { CircleCheckBig } from "lucide-react";

interface CreatingRegistrationProps {
	hasSuccess: boolean;
	isLoading: boolean;
}

export default function CreatingRegistration({
	hasSuccess,
	isLoading,
}: CreatingRegistrationProps) {
	const isLoadingState = isLoading && !hasSuccess;
	const hasSuccessState = hasSuccess; // <- success should not depend on isLoading

	const message = isLoadingState
		? "Creating Your Registration..."
		: hasSuccessState
			? "Registration successfully created! Redirecting to the dashboard..."
			: "Something Went Wrong. Please Try Again.";

	return (
		<main className="absolute inset-0 z-10 flex min-h-screen w-screen flex-col items-center justify-center gap-y-20 bg-background">
			<h1 className="w-full px-2 text-center text-3xl font-black md:px-0">
				{message}
			</h1>

			{hasSuccessState ? (
				<CircleCheckBig size={80} color="#16a34a" />
			) : (
				<ThreeCircles
					height="80"
					width="80"
					color="hsl(var(--primary))"
					ariaLabel="creating-registration-loading"
					visible={true}
				/>
			)}
		</main>
	);
}