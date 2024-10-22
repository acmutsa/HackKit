"use client";

import { useState, useEffect } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
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

	const { execute: runCheckInUserToHackathon, result: checkInResult } =
		useAction(checkInUserToHackathon);

	useEffect(() => {
		if (
			checkInResult &&
			checkInResult.data &&
			!checkInResult.data.success
		) {
			alert(
				`${checkInResult.data?.message ?? "Error checking in user To the hackathon"}`,
			);
		}
	}, [checkInResult]);
	function handleScanCreate() {
		const params = new URLSearchParams(searchParams.toString());
		const timestamp = parseInt(params.get("createdAt") as string);

		if (!scanUser) {
			return alert("User Not Found");
		}

		if (isNaN(timestamp)) {
			return alert("Invalid QR Code Data (Field: createdAt)");
		}
		if (checkedIn) {
			return alert("User Already Checked in!");
		} else {
			runCheckInUserToHackathon(scanUser.clerkID);
		}
		toast.success("Successfully Scanned User In");
		router.replace(`${path}`);
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
						<QrScanner
							onDecode={(result) => {
								const params = new URLSearchParams(
									searchParams.toString(),
								);
								if (!params.has("user")) {
									setScanLoading(true);
									const qrParsedData =
										superjson.parse<QRDataInterface>(
											result,
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
							onError={(error) => console.log(error?.message)}
							containerStyle={{
								width: "100vw",
								maxWidth: "500px",
								margin: "0",
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
