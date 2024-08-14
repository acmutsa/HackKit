import { cn } from "@/lib/utils/client/cn";
import { Loader2 } from "lucide-react";
interface LoadingProps {
	className?: string;
}

export default function Loading({ className }: LoadingProps) {
	return (
		<div className="flex w-full flex-col items-center justify-center space-y-4 pt-2">
			<h1 className="text-xl md:text-2xl lg:text-3xl">
				Loading. Please wait.
			</h1>
			<Loader2 className="animate-spin text-5xl duration-1000" />
		</div>
	);
}
