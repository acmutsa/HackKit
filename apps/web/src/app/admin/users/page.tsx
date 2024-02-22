import { db,ilike,or } from "db";
import { DataTable } from "@/components/dash/admin/users/UserDataTable";
import { columns } from "@/components/dash/admin/users/UserColumns";
import { Button } from "@/components/shadcn/ui/button";
import { FolderInput } from "lucide-react";
import { DefaultPagination } from "@/app/admin/DefaultPagination";
import SearchBar from "@/components/shared/SearchBar";
import { any } from "zod";

export default async function Page({searchParams}:{searchParams:{[key:string]:string | string[] |undefined}}) {
  // COME BACK AND CHANGE
  const maxPerPage = 30;

  let page = +(searchParams["page"] ?? "1");
  let user = searchParams["user"] ?? "Christian";

  console.log(page);
  console.log(user);

  const start = maxPerPage * (page - 1);
  const end = maxPerPage + start;


//   Might want to work with cache in prod to see if this will be plausible to do 
  const users = await db.query.users.findMany({
    with: {
      registrationData: true,
      profileData: true,
    },
    where: (users, { ilike }) =>
      or(
        ilike(users.firstName, `%${user}%`),
        ilike(users.lastName, `%${user}%`)
      ),
  });

  //   || like(users.lastName, `%${user}%`)

  return (
    <div className="max-w-7xl mx-auto px-5 pt-44">
      <div className="w-full grid grid-cols-3 mb-5">
        <div className="flex items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Users</h2>
            <p className="text-sm text-muted-foreground">
              {/*{users.length} */}Total Users
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
      <DataTable columns={columns} data={users.slice(start, end) as any} />
      <DefaultPagination maxPages={Math.ceil(users.length / maxPerPage)} />
    </div>
  );
}

export const runtime = "edge";
export const revalidate = 10;
