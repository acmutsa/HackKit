"use client";

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/shadcn/ui/pagination";
import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { createPath } from "@/lib/utils/shared/pageParams";

export function DefaultPagination({ maxPages }: { maxPages: number }) {
	// FIXME: Come back and change after done testing

	const path = usePathname();
	const params = useSearchParams();

	const page = params.get("page") ?? "1";

	const [currPage, setCurrPage] = useState(+page);
	const pageRef = useRef(1);

	function incPage() {
		pageRef.current = Math.min(maxPages, pageRef.current + 1);
		setCurrPage(Math.min(maxPages, currPage + 1));
	}

	function decPage() {
		pageRef.current = Math.max(1, pageRef.current - 1);
		setCurrPage(Math.max(1, currPage - 1));
	}

	function createPaginationPath(reqPage: string) {
		const url = `${path}?${reqPage}&user=${
			params.get("user") ?? ""
		}&checkedBoxes=${params.get("checkedBoxes") ?? ""}`;
		console.log("Pagination", url);
		return url;
	}

	return (
		<Pagination className="pt-4">
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						href={createPaginationPath(
							`${Math.max(1, pageRef.current - 1)}`,
						)}
						onClick={() => {
							decPage();
						}}
					/>
				</PaginationItem>
				{currPage}
				<PaginationItem>
					<PaginationNext
						//
						href={createPaginationPath(
							`${Math.min(maxPages, pageRef.current + 1)}`,
						)}
						onClick={() => {
							incPage();
						}}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
