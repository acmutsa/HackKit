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
import { Badge } from "@/components/shadcn/ui/badge";
import c from "config";
import { eventTableValidatorType } from "@/lib/types/events";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react"; // Assuming you're using this icon for the menu button
import { useRouter } from "next/navigation"; // for navigating after deletion
import { useAction } from "next-safe-action/hooks";
import { deleteEventAction } from "@/actions/admin/event-actions";
import { toast } from "sonner";

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
		accessorKey: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const [showConfirmation, setShowConfirmation] = useState(false);
			const [deleteError, setDeleteError] = useState<string | null>(null);
			const router = useRouter();
			const data = row.original;

			const handleDeleteClick = () => {
				setShowConfirmation(true);
			};

			const handleCancelDelete = () => {
				setShowConfirmation(false);
			};

			const { executeAsync: executeDeleteAction } =
				useAction(deleteEventAction);

			const handleConfirmDelete = async () => {
				try {
					// Replace with your delete API call
					await executeDeleteAction({ eventID: data.id });
					setShowConfirmation(false);
                    toast("Successfully deleted event!", {
                        duration: 1000
                    })
				} catch (error) {
					console.error("Error deleting event:", error);
					setDeleteError(
						"There was an error deleting the event. Please try again.",
					);
				}
			};

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem>
							<Link
								href={`/schedule/${data.id}`}
								className="h-full w-full"
							>
								View
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Link
								href={`/admin/scanner/${data.id}`}
								className="h-full w-full"
							>
								Scanner
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<Link
								href={`/admin/events/edit/${data.id}`}
								className="h-full w-full"
							>
								Edit
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={handleDeleteClick}
							className="text-red-500"
						>
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>

					{/* Delete confirmation */}
					{showConfirmation && (
						<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
							<div className="rounded border border-muted bg-black p-8 shadow-lg">
								<p>
									Are you sure you want to delete this event?
								</p>
								{deleteError && (
									<p className="text-red-500">
										{deleteError}
									</p>
								)}
								<div className="mt-4 flex gap-x-2">
									<Button
										onClick={handleConfirmDelete}
										variant={"destructive"}
									>
										Yes, Delete
									</Button>
									<Button
										onClick={handleCancelDelete}
                                        variant={"secondary"}
									>
										Cancel
									</Button>
								</div>
							</div>
						</div>
					)}
				</DropdownMenu>
			);
		},
	},
];

