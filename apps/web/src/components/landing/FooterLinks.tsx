"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "../shadcn/ui/dropdown-menu";
import Link from "next/link";

export default function FooterLinks({
  title,
  data,
}: {
  title: string;
  data: Readonly<{ name: string; link: string }[]>;
}) {
  return (
    <>
      <div className="col-span-2 lg:col-span-1 w-full flex lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger className="text-md font-bold mx-auto">
            <h1 className="text-xl text-orange-500">{title}</h1>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white">
            {data.map(({ name, link }) => (
              <DropdownMenuItem>
                <Link
                  className="text-sm font-semibold text-orange-500 block"
                  href={link}
                >
                  {name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex-col lg:flex hidden">
        <h1 className="font-bold text-2xl mb-2 text-orange-500">{title}</h1>
        {data.map(({ link, name }) => (
          <Link href={link} className="text-sm text-zinc-950 hover:underline">
            <h1 className="font-semibold">{name}</h1>
          </Link>
        ))}
      </div>
    </>
  );
}
