"use client";

import { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import superjson from "superjson";
import { checkInUserToHackathon } from "@/actions/admin/scanner-admin-actions";
import { type QRDataInterface } from "@/lib/utils/shared/qr";
import type { User } from "db/types";
import clsx from "clsx";
import { useAction } from "next-safe-action/hooks";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/shadcn/ui/drawer";
import { Button } from "@/components/shadcn/ui/button";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { FIVE_MINUTES_IN_MILLISECONDS } from "@/lib/constants";
import { ValidationErrors } from "next-safe-action";

interface CheckinScannerProps {
	hasScanned: boolean;
	checkedIn: boolean | null;
	scanUser: User | null;
	hasRSVP: boolean | null;
}

export default function CheckinScanner({
	hasScanned,
	checkedIn,
	scanUser,
	hasRSVP,
}: CheckinScannerProps) {
	console.log("scanner props is: ", hasScanned, checkedIn, scanUser, hasRSVP);

	const [scanLoading, setScanLoading] = useState(false);
	useEffect(() => {
		if (hasScanned) {
			setScanLoading(false);
		}
	}, [hasScanned]);

	const searchParams = useSearchParams();
	const path = usePathname();
	const router = useRouter();

	function handleUseActionFeedback(hasErrored = false, message = "") {
		console.log("called");
		toast.dismiss();
		hasErrored
			? toast.error(message || "Failed to Check User Into Hackathon")
			: toast.success(
					message || "Successfully Checked User Into Hackathon!",
				);
		router.replace(`${path}`);
	}

	const { execute: runCheckInUserToHackathon } = useAction(
		checkInUserToHackathon,
		{
			onSuccess: () => {
				handleUseActionFeedback();
			},
			onError: ({ error, input }) => {
				console.log("error is: ", error);
				console.log("input is: ", input);
				if (error.validationErrors?.QRTimestamp?._errors) {
					handleUseActionFeedback(
						true,
						error.validationErrors.QRTimestamp._errors[0],
					);
				} else {
					handleUseActionFeedback(true);
				}
			},
		},
	);

	function handleScanCreate() {
		const params = new URLSearchParams(searchParams.toString());
		const timestamp = parseInt(params.get("createdAt") as string);

		if (!scanUser) {
			return alert("User Not Found");
		}

		if (isNaN(timestamp)) {
			return alert("Invalid QR Code Data (Field: createdAt)");
		}
		if (Date.now() - timestamp > FIVE_MINUTES_IN_MILLISECONDS) {
			return alert(
				"QR Code has expired. Please tell user to refresh the QR Code",
			);
		}

		if (checkedIn) {
			return alert("User Already Checked in!");
		} else {
			toast.loading("Checking User In");
			runCheckInUserToHackathon({
				userID: scanUser.clerkID,
				QRTimestamp: timestamp,
			});
		}
		router.replace(path);
	}

	const drawerTitle = checkedIn
		? "User Already Checked In"
		: !hasRSVP
			? "Warning!"
			: "New Scan";
	const drawerDescription = checkedIn
		? "If this is a mistake, please talk to an admin"
		: !hasRSVP
			? `${scanUser?.firstName} ${scanUser?.lastName} Is not RSVP'd`
			: `New scan for ${scanUser?.firstName} ${scanUser?.lastName}`;
	const drawerFooterButtonText = checkedIn
		? "Close"
		: !hasRSVP
			? "Check In Anyways"
			: "Scan User In";

	return (
		<>
			<div className="flex h-dvh flex-col items-center justify-center pt-32">
				<div className="flex w-screen flex-col items-center justify-center gap-5">
					<div className="mx-auto aspect-square w-screen max-w-[500px] overflow-hidden">
						<Scanner
							onScan={(result) => {
								const params = new URLSearchParams(
									searchParams.toString(),
								);
								if (!params.has("user")) {
									setScanLoading(true);
									const qrParsedData =
										superjson.parse<QRDataInterface>(
											result[0].rawValue,
										);
									params.set("user", qrParsedData.userID);
									params.set(
										"createdAt",
										qrParsedData.createdAt
											.getTime()
											.toString(),
									);
									router.replace(
										`${path}?${params.toString()}`,
									);
								}
							}}
							onError={(error) => console.log(error)}
							styles={{
								container: {
									width: "100vw",
									maxWidth: "500px",
									margin: "0",
								},
							}}
						/>
					</div>
				</div>
			</div>
			<Drawer
				onClose={() => router.replace(path)}
				open={hasScanned || scanLoading}
			>
				<DrawerContent>
					{scanLoading ? (
						<>
							<DrawerHeader>
								<DrawerTitle>Loading Scan...</DrawerTitle>
							</DrawerHeader>
							<DrawerFooter>
								<Button
									onClick={() => router.replace(path)}
									variant="outline"
								>
									Cancel
								</Button>
							</DrawerFooter>
						</>
					) : (
						<>
							<DrawerHeader>
								<DrawerTitle
									className={clsx("mx-auto", {
										"text-red-500": !hasRSVP || checkedIn,
									})}
								>
									{drawerTitle}
								</DrawerTitle>
							</DrawerHeader>
							<DrawerDescription className="mx-auto">
								{drawerDescription}
							</DrawerDescription>
							<DrawerFooter>
								{!hasRSVP && !checkedIn && (
									<div className="mx-auto">
										Do you wish to proceed?
									</div>
								)}
								{!checkedIn && (
									<Button
										onClick={() => {
											handleScanCreate();
										}}
										variant="outline"
									>
										{drawerFooterButtonText}
									</Button>
								)}
								<Button
									onClick={() => router.replace(path)}
									variant="outline"
								>
									Cancel
								</Button>
							</DrawerFooter>
						</>
					)}
				</DrawerContent>
			</Drawer>
		</>
	);
}
