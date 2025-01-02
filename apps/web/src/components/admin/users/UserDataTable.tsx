"use client";

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	SortingState,
	getSortedRowModel,
	getPaginationRowModel,
	ColumnFiltersState,
	getFilteredRowModel,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/shadcn/ui/table";
import { Input } from "@/components/shadcn/ui/input";
import { Button } from "@/components/shadcn/ui/button";
import { useEffect, useState } from "react";
import { dataTableFuzzyFilter } from "@/lib/utils/client/shared";
interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [globalFilter, setGlobalFilter] = useState("");

	const table = useReactTable({
		data,
		columns,
		filterFns: {
			fuzzy: dataTableFuzzyFilter,
		},
		state: {
			sorting,
			columnFilters,
			globalFilter,
		},
		onColumnFiltersChange: setColumnFilters,
		globalFilterFn: dataTableFuzzyFilter,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	useEffect(() => {
		console.log("column filters", columnFilters);
	}, [columnFilters]);

	return (
		<div>
			<div className="space-y-3 rounded-md border">
				<div className="px-4 pt-4">
					<Input
						placeholder="Filter users..."
						value={globalFilter}
						onChange={(event) => {
							// we want to set our global filter
							setGlobalFilter(event.target.value);
						}}
						className="max-w-sm"
					/>
				</div>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className="hover:bg-inherit"
							>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											className="pb-4"
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef
															.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={
										row.getIsSelected() && "selected"
									}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
		</div>
	);
}
