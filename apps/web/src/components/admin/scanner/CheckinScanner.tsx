"use client";

import { useState, useEffect } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import superjson from "superjson";
import { checkInUser } from "@/actions/admin/scanner-admin-actions";
import { useAction } from "next-safe-action/hook";
import { type QRDataInterface } from "@/lib/utils/shared/qr";
import type { User } from "db/types";

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

/*

Pass Scanner Props:

eventName: name of the event that the user is scanning into
hasScanned: if the state has eventered one in which a QR has been scanned (whether that scan has scanned before or not)
scan: the scan object that has been scanned. If they have not scanned before scan will be null leading to a new record or if they have then it will incriment the scan count.

*/

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
	const [scanLoading, setScanLoading] = useState(false);
	const { execute: runScanAction } = useAction(checkInUser, {});
	const [proceed, setProceed] = useState(hasRSVP);
	useEffect(() => {
		if (hasScanned) {
			setScanLoading(false);
		}
	}, [hasScanned]);

	const searchParams = useSearchParams();
	const path = usePathname();
	const router = useRouter();

	function handleScanCreate() {
		const params = new URLSearchParams(searchParams.toString());
		const timestamp = parseInt(params.get("createdAt") as string);
		if (isNaN(timestamp)) {
			return alert("Invalid QR Code Data (Field: createdAt)");
		}
		if (checkedIn) {
			return alert("User Already Checked in!");
		} else {
			// TODO: make this a little more typesafe
			runScanAction(scanUser?.clerkID!);
		}
		toast.success("Successfully Scanned User In");
		router.replace(`${path}`);
	}

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
					{/* <div className="mx-auto flex w-screen max-w-[500px] justify-center gap-x-2 overflow-hidden">
            <Link href={"/admin/events"}>
              <Button>Return To Events</Button>
            </Link>
          </div> */}
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
								{/* <DrawerDescription></DrawerDescription> */}
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
								{checkedIn ? (
									<DrawerTitle className="mx-auto">
										User already checked in!
									</DrawerTitle>
								) : (
									<>
										{!proceed ? (
											<>
												<DrawerTitle className="text-red-500">
													Warning!
												</DrawerTitle>
												<DrawerDescription>
													{scanUser?.firstName}{" "}
													{scanUser?.lastName} Is not
													RSVP'd
												</DrawerDescription>
												<DrawerFooter>
													Do you wish to proceed?
													<Button
														onClick={() => {
															setProceed(true);
														}}
														variant="outline"
													>
														Proceed
													</Button>
													<Button
														onClick={() =>
															router.replace(path)
														}
														variant="outline"
													>
														Cancel
													</Button>
												</DrawerFooter>
											</>
										) : (
											<>
												<DrawerTitle>
													New Scan
												</DrawerTitle>
												<DrawerDescription>
													New scan for{" "}
													{scanUser?.firstName}{" "}
													{scanUser?.lastName}
												</DrawerDescription>
											</>
										)}
									</>
								)}
							</DrawerHeader>
							{proceed ? (
								<>
									<DrawerFooter>
										{!checkedIn && (
											<Button
												onClick={() =>
													handleScanCreate()
												}
											>
												{"Scan User In"}
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
							) : (
								<></>
							)}
						</>
					)}
				</DrawerContent>
			</Drawer>
		</>
	);
}
