// app/admin/_components/admin-breadcrumbs.tsx
"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "ui/components/breadcrumb";
import { BreadcrumbLabels } from "@/lib/constants/admin";
import React from "react";

function formatSegment(segment: string) {
	return (
		BreadcrumbLabels[segment] ??
		decodeURIComponent(segment)
			.replace(/-/g, " ")
			.replace(/\b\w/g, (char) => char.toUpperCase())
	);
}

export function AdminBreadcrumbs() {
	const segments = useSelectedLayoutSegments();

	const visibleSegments = segments.filter(
		(segment) => !segment.startsWith("(") && !segment.startsWith("@"),
	);

	const allSegments = ["admin", ...visibleSegments];

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{allSegments.map((segment, index) => {
					const href =
						"/" + allSegments.slice(0, index + 1).join("/");
					const isLast = index === allSegments.length - 1;

					return (
						<React.Fragment key={segment}>
							<BreadcrumbItem
								className={!isLast ? "hidden md:block" : ""}
							>
								{isLast ? (
									<BreadcrumbPage className="text-base">
										{formatSegment(segment)}
									</BreadcrumbPage>
								) : (
									<BreadcrumbLink asChild>
										<Link href={href} className="text-base">
											{formatSegment(segment)}
										</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>

							{!isLast && (
								<BreadcrumbSeparator className="hidden md:block" />
							)}
						</React.Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
