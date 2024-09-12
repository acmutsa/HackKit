import { db, ilike, or, and, eq } from "db";
import { DataTable } from "@/components/admin/users/UserDataTable";
import { columns } from "@/components/admin/users/UserColumns";
import { Button } from "@/components/shadcn/ui/button";
import { FolderInput } from "lucide-react";
import { DefaultPagination } from "@/components/admin/users/DefaultPagination";
import SearchBar from "@/components/admin/users/SearchBar";
import { userCommonData } from "db/schema";

export default async function Page({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
	// COME BACK AND CHANGE
	const maxPerPage = 30;

	let page = +(searchParams["page"] ?? "1");
	let user = searchParams["user"] ?? "";
	const checkedBoxes = searchParams["checkedBoxes"] ?? "";

	console.log(checkedBoxes);

	const start = maxPerPage * (page - 1);
	const end = maxPerPage + start;

	//   Might want to work with cache in prod to see if this will be plausible to do
	const userData = await db.query.userCommonData.findMany({
		with: { hackerData: true },
		where: and(
			or(
				ilike(userCommonData.firstName, `%${user}%`),
				ilike(userCommonData.lastName, `%${user}%`),
			),
		),
	});

	return (
		<div className="mx-auto max-w-7xl px-5 pt-44">
			<div className="mb-5 grid w-full grid-cols-3">
				<div className="flex items-center">
					<div>
						<h2 className="text-3xl font-bold tracking-tight">
							Users
						</h2>
						<p className="text-sm text-muted-foreground">
							Total Users: {userData.length}
						</p>
					</div>
				</div>
				<SearchBar />
				<div className="flex items-center justify-end">
					<a download href="/api/admin/export">
						<Button className="flex gap-x-1">
							<FolderInput />
							Export
						</Button>
					</a>
				</div>
			</div>
			{/* TODO: Would very much like to not have "as any" here in the future */}
			<div className="flex w-full space-x-10">
				{userData && userData.length > 0 ? (
					<>
						<DataTable
							columns={columns}
							data={userData.slice(start, end) as any}
						/>
					</>
				) : (
					<div className="flex w-full items-center justify-center">
						<h1>No Results :(</h1>
					</div>
				)}
				{/* <Filters/> */}
			</div>
			<DefaultPagination
				maxPages={Math.ceil(userData.length / maxPerPage)}
			/>
		</div>
	);
}

export const runtime = "edge";
export const revalidate = 10;
