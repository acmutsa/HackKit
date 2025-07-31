"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/shadcn/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogTrigger,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/shadcn/ui/alert-dialog";
import { Badge } from "@/components/shadcn/ui/badge";
import c from "config";
import { eventTableValidatorType } from "@/lib/types/events";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { deleteEventAction } from "@/actions/admin/event-actions";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { error } from "console";

type EventRow = eventTableValidatorType & { isUserAdmin: boolean };

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
				{new Date(row.original.startTime).toLocaleDateString()}{" "}
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
				{new Date(row.original.endTime).toLocaleDateString()}{" "}
				{new Date(row.original.endTime).toLocaleTimeString("en-US", {
					hour: "2-digit",
					minute: "2-digit",
				})}
			</span>
		),
	},
	{
		accessorKey: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const [open, setOpen] = useState(false);
			const router = useRouter();
			const data = row.original;

			const { execute: executeDeleteAction } = useAction(
				deleteEventAction,
				{
					onSuccess: () => {
						toast.dismiss();
						toast.success("Event deleted successfully");
						router.refresh();
						setOpen(false);
					},
					onError: ({ error: err }) => {
						let description: string;

						if (err.validationErrors?._errors) {
							// User is not super admin
							description = err.validationErrors._errors[0];
						} else {
							description =
								err.serverError || "An unknown error occurred";
						}

						toast.error("Unable to edit event", { description });
						toast.dismiss();
						toast.error("Failed to delete event");
						console.log(err);
					},
				},
			);
			return (
				<AlertDialog open={open} onOpenChange={setOpen}>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								asChild
								className="h-full w-full cursor-pointer"
							>
								<Link
									href={`/schedule/${data.id}`}
									className="h-full w-full"
								>
									View
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem
								asChild
								className="h-full w-full cursor-pointer"
							>
								<Link
									href={`/admin/scanner/${data.id}`}
									className="h-full w-full"
								>
									Scanner
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							{row.original.isUserAdmin && (
								<DropdownMenuItem
									className="h-full w-full cursor-pointer"
									asChild
								>
									<Link
										href={`/admin/events/edit/${data.id}`}
										className="h-full w-full"
									>
										Edit
									</Link>
								</DropdownMenuItem>
							)}
							{row.original.isUserAdmin && (
								<DropdownMenuItem
									asChild
									className="h-full w-full cursor-pointer text-red-500"
								>
									<AlertDialogTrigger>
										Delete
									</AlertDialogTrigger>
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								Confirm Deletion
							</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to delete this event?
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => {
									toast.loading("Deleting event...");
									executeDeleteAction({ eventID: data.id });
								}}
								className="text-red-500"
							>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			);
		},
	},
];
