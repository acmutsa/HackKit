import { db } from "@/db";
import { users, profileData, registrationData } from "@/db/schema";
import { eq } from "drizzle-orm";
import { clerkClient } from "@clerk/nextjs/server";
import Image from "next/image";
import FullScreenMessage from "@/components/shared/FullScreenMessage";
import { Button } from "@/components/shadcn/ui/button";

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/shadcn/ui/table";

export default async function Page({ params }: { params: { slug: string } }) {
	const user = await db.query.users.findFirst({
		where: eq(users.clerkID, params.slug),
		with: {
			profileData: true,
			registrationData: true,
		},
	});

	if (!user) {
		return <p className="text-center font-bold">User Not Found</p>;
	}

	return (
		<div className="mx-auto max-w-7xl overflow-x-hidden">
			<div className="grid grid-cols-2 rounded-lg border border-muted p-2">
				<div className="rounded-xl flex items-center">
					<Image
						src={user.profileData.profilePhoto}
						alt={`${user.firstName} ${user.lastName}'s Profile Photo`}
						height={50}
						width={50}
						className="rounded-full"
					/>
					<div className="col-span-2 flex flex-col justify-center pl-2">
						<h1 className="text-2xl font-semibold">
							{user.firstName} {user.lastName}
						</h1>
						<h2 className="text-muted-foreground">@{user.hackerTag}</h2>
					</div>
				</div>
				<div className="flex justify-end items-center w-full gap-x-2">
					<Button>Copy Email</Button>
					<Button>Copy Discord</Button>
					<Button>Check-in</Button>
				</div>
			</div>
			<div className="grid grid-cols-2 gap-2 mt-2">
				<div className="border-muted border rounded-lg">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[100px]">Item</TableHead>
								<TableHead>Response</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{Object.entries(user.registrationData).map(([key, value]) => {
								const valToRender = typeof value === "string" ? value : JSON.stringify(value);
								return (
									<TableRow>
										<TableCell className="font-medium">{key}</TableCell>
										<TableCell>{valToRender}</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}

export const runtime = "edge";
