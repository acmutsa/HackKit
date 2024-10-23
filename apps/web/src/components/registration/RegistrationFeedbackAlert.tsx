import { Dispatch, SetStateAction } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../shadcn/ui/alert-dialog";
import { CircleAlert } from "lucide-react";

interface RegistrationFeedbackAlertProps {
	hasError: boolean;
	messasge: string;
	className?: string;
	setErrorMessage: Dispatch<SetStateAction<string | null>>;
}

export default function RegistrationFeedbackAlert(
	props: RegistrationFeedbackAlertProps,
) {
	const { hasError, messasge, className, setErrorMessage } = props;
	return (
		<AlertDialog
			onOpenChange={(_) => {
				setErrorMessage(null);
			}}
			open={true}
		>
			<AlertDialogTrigger
				asChild
				className={`absolute bottom-2 right-0 ${className}`}
			>
				<CircleAlert color="red" className="hover:cursor-pointer" />
			</AlertDialogTrigger>
			<AlertDialogContent className="w-[90%] sm:w-3/4">
				<AlertDialogHeader>
					<AlertDialogTitle asChild>
						<div className="flex flex-row items-center gap-2">
							<CircleAlert color="red" />
							<p>{"An Error Occured."}</p>
						</div>
					</AlertDialogTitle>
					<AlertDialogDescription className="w-full text-start">
						{messasge}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Back to Form</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
