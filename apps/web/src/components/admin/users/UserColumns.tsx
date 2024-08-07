"use client";

import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { userCommonData } from "db/schema";
import Link from "next/link";
import { Button } from "@/components/shadcn/ui/button";

const userValidator = createSelectSchema(userCommonData);

export type userValidatorType = Pick<
	z.infer<typeof userValidator>,
	| "clerkID"
	| "signupTime"
	| "firstName"
	| "lastName"
	| "hackerTag"
	| "email"
	| "role"
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
		accessorKey: "hackerTag",
		header: "Hacker Tag",
		cell: ({ row }) => `@${row.original.hackerTag}`,
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
		accessorKey: "signupTime",
		header: "Signup Date",
		cell: ({ row }) => (
			<span suppressHydrationWarning={true}>
				{new Date(row.original.signupTime).toLocaleDateString() + " "}
				{new Date(row.original.signupTime).toLocaleTimeString("en-US", {
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
