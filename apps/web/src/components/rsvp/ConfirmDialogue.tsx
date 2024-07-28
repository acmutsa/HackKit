"use client";

import { useWindowSize } from "usehooks-ts";
import Confetti from "react-confetti";
import { Button } from "@/components/shadcn/ui/button";
import { useState, useEffect } from "react";
import { useAction } from "next-safe-action/hook";
import { rsvpMyself } from "@/actions/rsvp";
import { CheckCircleIcon } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ConfirmDialogue({ hasRsvped }: { hasRsvped: boolean }) {
	const [showConfetti, setShowConfetti] = useState(false);
	const { width = 0, height = 0 } = useWindowSize();
	const router = useRouter();

	const { execute } = useAction(rsvpMyself, {
		onSuccess: () => {
			toast.dismiss();
			router.refresh();
		},
	});

	useEffect(() => {
		if (hasRsvped) {
			setShowConfetti(true);
		}
	}, [hasRsvped]);

	return (
		<>
			{showConfetti && (
				<Confetti
					onConfettiComplete={() => setShowConfetti(false)}
					recycle={false}
					run={showConfetti}
					numberOfPieces={200}
					width={width}
					height={height}
				/>
			)}
			{hasRsvped ? (
				<div className="w-full max-w-[500px] aspect-video relative dark:bg-white/[0.08] bg-white backdrop-blur transition rounded-xl p-5 flex flex-col items-center justify-center">
					<h1 className="flex items-center gap-x-2 font-bold text-2xl text-green-500">
						<CheckCircleIcon />
						You have RSVPed!
					</h1>
					<p className="pt-5 pb-10">We can't wait to see you at the event!</p>
					<Link href={"/dash"}>
						<Button>Go To Dashboard</Button>
					</Link>
				</div>
			) : (
				<div className="w-full max-w-[500px] aspect-video relative dark:bg-white/[0.08] bg-white backdrop-blur transition rounded-xl p-5 flex flex-col items-center justify-center">
					<p className="text-gray-400 text-sm text-center px-10 pb-5 absolute bottom-0">
						Psst. make sure you only RSVP if you are certain you can attend the event!
					</p>
					<Button
						onClick={() => {
							execute(null);
							toast.loading("Confirming your RSVP...", { duration: 0 });
						}}
						size={"lg"}
						className="font-bold"
					>
						Confirm RSVP
					</Button>
				</div>
			)}
		</>
	);
}
