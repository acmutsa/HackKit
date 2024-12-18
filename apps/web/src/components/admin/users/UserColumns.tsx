"use client";

import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { userCommonData } from "db/schema";
import Link from "next/link";
import { Button } from "@/components/shadcn/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../../shadcn/ui/dropdown-menu";
import { MoreHorizontal,ArrowUpDown } from "lucide-react";
import type { Column,Row } from "@tanstack/react-table";
import { dataTableFuzzyFilter } from "@/lib/utils/client/shared";

const userValidator = createSelectSchema(userCommonData);

// default fuzzy search and add filters by each column if possible 
export type userValidatorType = Pick<
	z.infer<typeof userValidator>,
	| "clerkID"
	| "signupTime"
	| "firstName"
	| "lastName"
	| "email"
	| "role"
	| 'isRSVPed'
	| 'hackerTag'
	| 'checkinTimestamp'
>;

type UserColumnType = Column<userValidatorType, unknown>;

export const columns: ColumnDef<userValidatorType>[] = [
	{
		accessorKey: "firstName",
		header: ({ column }) => {
			return <SortColumnButton name="Name" column={column} />;
		},
		cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
		// filterFn: (row, _columnId, filterValue) => {
		// 	return row.original.firstName.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase()) || row.original.lastName.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase());
		// },
		filterFn: "includesString",
		
	},
	{
		accessorKey: "email",
		header: ({ column }) => {
			return <SortColumnButton name="Email" column={column} />;
		},
		filterFn: dataTableFuzzyFilter,
	},
	{
		accessorKey: "hackerTag",
		header: "Hacker Tag",
		cell: ({ row }) => `@${row.original.hackerTag}`,
		filterFn: dataTableFuzzyFilter,
	},
	{
		accessorKey: "isRSVPed",
		header: "RSVP Status",
		cell: ({ row }) => (row.original.isRSVPed ? "RSVPed" : "Not RSVPed"),
	},
	{
		accessorKey: "checkinTimestamp",
		header: ({ column }) => {
			return <SortColumnButton name="Checkin Time" column={column} />;
		},
		cell: ({ row }) => (
			<span suppressHydrationWarning={true}>
				{row.original.checkinTimestamp
					? new Date(
							row.original.checkinTimestamp,
						).toLocaleDateString() +
						" " +
						new Date(
							row.original.checkinTimestamp,
						).toLocaleTimeString("en-US", {
							hour: "2-digit",
							minute: "2-digit",
						})
					: "Not Checked In"}
			</span>
		),
	},
	{
		accessorKey: "role",
		header: "Role",
		filterFn:"includesString"
	},
	{
		accessorKey: "signupTime",
		header: ({ column }) => {
			return <SortColumnButton name="Signup Time" column={column} />;
		},
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
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			return <UserDropDownActions row={row} />;
		},
	},
];

function UserDropDownActions({row}:{row:Row<userValidatorType>}) {
	const user = row.original;
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal size={20} />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem>
							<Link href={`/admin/users/${user.clerkID}`}>
								View User
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() =>
								navigator.clipboard.writeText(user.clerkID)
							}
							className="cursor-pointer"
						>
							Copy Clerk ID
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Link
								href={`mailto:${user.email}`}
								target="_blank"
								prefetch={false}
							>
								Email User
							</Link>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		}

function SortColumnButton({name,column}:{name:string,column:UserColumnType}) {
	return (
		<Button
			variant="ghost"
			onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
		>
			{name}
			<ArrowUpDown className="ml-2 h-4 w-4" />
		</Button>
	)
}

