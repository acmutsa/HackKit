"use client";

import { useState, useEffect } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import superjson from "superjson";
import { getScan } from "@/actions/admin/scanner-admin-actions";
import { useAction } from "next-safe-action/hook";
import { type QRDataInterface } from "@/lib/utils/shared/qr";
import type { scansType, userType } from "@/lib/utils/shared/types";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/shadcn/ui/drawer";
import { Button } from "@/components/shadcn/ui/button";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

/*

Pass Scanner Props:

eventName: name of the event that the user is scanning into
hasScanned: if the state has eventered one in which a QR has been scanned (whether that scan has scanned before or not)
scan: the scan object that has been scanned. If they have not scanned before scan will be null leading to a new record or if they have then it will incriment the scan count.

*/

interface PassScannerProps {
	eventName: string;
	hasScanned: boolean;
	scan: scansType | null;
	scanUser: userType | null;
}

export default function PassScanner({ eventName, hasScanned, scan, scanUser }: PassScannerProps) {
	const [scanLoading, setScanLoading] = useState(false);

	useEffect(() => {
		if (hasScanned) {
			setScanLoading(false);
		}
	}, [hasScanned]);

	const searchParams = useSearchParams();
	const path = usePathname();
	const router = useRouter();

	return (
		<>
			<div className="flex flex-col items-center justify-center pt-32 h-dvh">
				<div className="w-screen flex flex-col items-center justify-center gap-5">
					<div className="w-screen max-w-[500px] aspect-square overflow-hidden mx-auto">
						<QrScanner
							onDecode={(result) => {
								const params = new URLSearchParams(searchParams);
								if (!params.has("user")) {
									setScanLoading(true);
									const qrParsedData = superjson.parse<QRDataInterface>(result);
									params.set("user", qrParsedData.userID);
									router.replace(`${path}?${params.toString()}`);
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
					<div className="w-screen max-w-[500px] flex justify-center gap-x-2 overflow-hidden mx-auto">
						<Link href={"/admin/events"}>
							<Button>Return To Events</Button>
						</Link>
					</div>
				</div>
			</div>
			<Drawer onClose={() => router.replace(path)} open={hasScanned || scanLoading}>
				<DrawerContent>
					{scanLoading ? (
						<>
							<DrawerHeader>
								<DrawerTitle>Loading Scan...</DrawerTitle>
								<DrawerDescription></DrawerDescription>
							</DrawerHeader>
							<DrawerFooter>
								<Button onClick={() => router.replace(path)} variant="outline">
									Cancel
								</Button>
							</DrawerFooter>
						</>
					) : (
						<>
							<DrawerHeader>
								<DrawerTitle>New Scan for {eventName}</DrawerTitle>
								<DrawerDescription>
									New scan for {scanUser?.firstName} {scanUser?.lastName}
								</DrawerDescription>
							</DrawerHeader>
							<DrawerFooter>
								<Button>{scan ? "Add Additional Scan" : "Scan User In"}</Button>

								<Button variant="outline">Cancel</Button>
							</DrawerFooter>
						</>
					)}
				</DrawerContent>
			</Drawer>
		</>
	);
}
