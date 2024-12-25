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
import { Input } from "@/components/shadcn/ui/input";
import { MoreHorizontal, ArrowUpDown, User } from "lucide-react";
import type { Column, Row } from "@tanstack/react-table";
import { dataTableFuzzyFilter } from "@/lib/utils/client/shared";
import { Badge } from "@/components/shadcn/ui/badge";

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
	| "isRSVPed"
	| "hackerTag"
	| "checkinTimestamp"
>;

type UserColumnType = Column<userValidatorType, unknown>;

export const columns: ColumnDef<userValidatorType>[] = [
	{
		accessorFn: (row) => `${row.firstName} ${row.lastName}`,
		id: "name",
		header: ({ column }) => (
			<UserTableHeader name="Name" column={column} hasFilter={true} />
		),
		cell: (info) => info.getValue(),
		// filterFn: (row, _columnId, filterValue) => {
		// 	return row.original.firstName.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase()) || row.original.lastName.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase());
		// },
		filterFn: dataTableFuzzyFilter,
	},
	{
		accessorKey: "email",
		header: ({ column }) => (
			<UserTableHeader name="Email" column={column} hasFilter={true} />
		),
		filterFn: "includesString",
		cell: (info) => info.getValue(),
	},
	{
		accessorKey: "hackerTag",
		header: ({ column }) => (
			<UserTableHeader
				name="Hacker Tag"
				column={column}
				hasFilter={true}
			/>
		),
		cell: ({ row }) => `@${row.original.hackerTag}`,
		filterFn: dataTableFuzzyFilter,
	},
	{
		accessorKey: "role",
		header: ({ column }) => (
			<UserTableHeader name="Role" column={column} hasFilter={true} />
		),
		filterFn: "includesString",
	},
	{
		accessorKey: "isRSVPed",
		header: ({ column }) => (
			<div className="flex h-full flex-row justify-center">
				<span className="whitespace-nowrap py-2">RSVP Status</span>
				<SortColumnButton name="Checkin Time" column={column} />
			</div>
		),
		// row.original.isRSVPed ?
		cell: ({ row }) => (
			<Badge className="no-select border-2" variant="outline">
				<div
					className={`mx-0 h-2 w-2 rounded-full ${row.original.isRSVPed ? "bg-green-400" : "bg-red-400"}`}
				/>
				<span className="ml-2">
					RSVP: {row.original.isRSVPed ? "Yes" : "No"}
				</span>
			</Badge>
		),
	},
	{
		accessorKey: "checkinTimestamp",
		header: ({ column }) => (
			<div className="flex h-full flex-row justify-center">
				<span className="whitespace-nowrap py-2">Checkin Time</span>
				<SortColumnButton name="Checkin Time" column={column} />
			</div>
		),
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
	// {
	// 	accessorKey: "role",
	// 	header: ({ column }) => (
	// 		<UserTableHeader name="Role" column={column} hasFilter={true} />
	// 	),
	// 	filterFn: "includesString",
	// },
	{
		accessorKey: "signupTime",
		header: ({ column }) => (
			<div className="flex h-full flex-row justify-center">
				<span className="whitespace-nowrap py-2">Signup Time</span>
				<SortColumnButton name="Checkin Time" column={column} />
			</div>
		),
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

function UserDropDownActions({ row }: { row: Row<userValidatorType> }) {
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
					<Link href={`/admin/users/${user.clerkID}`}>View User</Link>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => navigator.clipboard.writeText(user.clerkID)}
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

function UserTableHeader({
	name,
	column,
	hasFilter,
}: {
	name: string;
	column: UserColumnType;
	hasFilter: boolean;
}) {
	return (
		<div className="flex flex-col items-center">
			<div className="flex w-full flex-row items-center justify-between">
				{name}
				{hasFilter && <SortColumnButton name={name} column={column} />}
			</div>
			<Input
				value={(column.getFilterValue() ?? "") as string}
				onChange={(e) => column.setFilterValue(e.target.value)}
				placeholder="search..."
			/>
		</div>
	);
}

function SortColumnButton({
	name,
	column,
}: {
	name: string;
	column: UserColumnType;
}) {
	return (
		<Button
			variant="ghost"
			onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
		>
			<ArrowUpDown className="h-4 w-4" />
		</Button>
	);
}
