"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/shadcn/ui/button";
import { Badge } from "@/components/shadcn/ui/badge";
import c from "config";
import { eventTableValidatorType } from "@/lib/types/events";
import { cn } from "@/lib/utils/client/cn";

type EventRow = eventTableValidatorType & { isSuperAdmin: boolean };

export const columns: ColumnDef<EventRow>[] = [
	{
		accessorKey: "title",
		header: "Title",
		cell: ({ row }) => (
			<span className="flex items-center gap-x-3 font-bold">
				{row.original.title}{" "}
				<Badge
					className="text-sm"
					variant={"outline"}
					style={{
						borderColor:
							(c.eventTypes as Record<string, string>)[
								row.original.type
							] || c.eventTypes.Other,
					}}
				>
					{row.original.type}
				</Badge>
			</span>
		),
	},
	{
		accessorKey: "location",
		header: "Location",
		cell: ({ row }) => <span>{row.original.location}</span>,
	},
	{
		accessorKey: "startTime",
		header: "Start",
		cell: ({ row }) => (
			<span>
				{new Date(row.original.startTime).toLocaleDateString() + " "}
				{new Date(row.original.startTime).toLocaleTimeString("en-US", {
					hour: "2-digit",
					minute: "2-digit",
				})}
			</span>
		),
	},
	{
		accessorKey: "endTime",
		header: "End",
		cell: ({ row }) => (
			<span>
				{new Date(row.original.endTime).toLocaleDateString() + " "}
				{new Date(row.original.endTime).toLocaleTimeString("en-US", {
					hour: "2-digit",
					minute: "2-digit",
				})}
			</span>
		),
	},
	{
		accessorKey: "Scanner",
		header: "Scanner",
		cell: ({ row }) => (
			<Link href={`/admin/scanner/${row.original.id}`}>
				<Button>Scanner</Button>
			</Link>
		),
	},
	{
		accessorKey: "View",
		header: "View",
		cell: ({ row }) => (
			<Link href={`/schedule/${row.original.id}`}>
				<Button>View</Button>
			</Link>
		),
	},
	{
		accessorKey: "Edit",
		header: "Edit",
		cell: ({ row }) => (
			<Link
				href={`/admin/events/edit/${row.original.id}`}
				className={cn(
					!row.original.isSuperAdmin && "pointer-events-none",
				)}
			>
				<Button disabled={!row.original.isSuperAdmin}>Edit</Button>
			</Link>
		),
	},
];
