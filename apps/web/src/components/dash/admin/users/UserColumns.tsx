"use client";

import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { users, registrationData, profileData } from "@/db/schema";
import Link from "next/link";
import { Button } from "@/components/shadcn/ui/button";

const userValidator = createSelectSchema(users).merge(
	z.object({
		registrationData: createSelectSchema(registrationData),
		profileData: createSelectSchema(profileData).merge(
			z.object({
				skills: z.array(z.string()),
			})
		),
	})
);

export type userValidatorType = Pick<
	z.infer<typeof userValidator>,
	"clerkID" | "createdAt" | "firstName" | "lastName" | "profileData" | "email" | "role"
>;

export const columns: ColumnDef<userValidatorType>[] = [
	{
		accessorKey: "firstName",
		header: "Name",
		cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "profileData.hackerTag",
		header: "Hacker Tag",
		cell: ({ row }) => `@${row.original.profileData.hackerTag}`,
	},
	{
		accessorKey: "clerkID",
		header: "Account ID",
	},
	{
		accessorKey: "role",
		header: "Role",
	},
	{
		accessorKey: "createdAt",
		header: "Signup Date",
		cell: ({ row }) => (
			<span suppressHydrationWarning={true}>
				{new Date(row.original.createdAt).toLocaleDateString() + " "}
				{new Date(row.original.createdAt).toLocaleTimeString("en-US", {
					hour: "2-digit",
					minute: "2-digit",
				})}
			</span>
		),
	},
	{
		accessorKey: "clerkID2",
		header: "View",
		cell: ({ row }) => (
			<Link href={`/admin/users/${row.original.clerkID}`}>
				<Button>View</Button>
			</Link>
		),
	},
];
