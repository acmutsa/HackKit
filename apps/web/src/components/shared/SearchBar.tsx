"use client";

import { Input } from "@/components/shadcn/ui/input";
import {useRouter,useSearchParams,usePathname } from "next/navigation";
import { createPath } from "@/lib/utils/shared/pageParams";
export default function SearchBar(){
  const router = useRouter();
  const params = useSearchParams();

  // Uses path name it is already on...?
  const path = usePathname();
  const user = params.get("user") ?? "";

  const checkedBoxes = params.get("checkedBoxes") ?? "";

  function handleSearch(user: string) {
    const url = `${path}?page=1&user=${user}&checkedBoxes=${checkedBoxes}`;
    console.log("searchbar",url);
    router.push(url);
  }

  return(
    <Input
    placeholder="Search for users"
    onChange={(e) => {
      handleSearch(e.target.value);
    }}
    // Render a little x here to clear out the stuff
  />
  );
}