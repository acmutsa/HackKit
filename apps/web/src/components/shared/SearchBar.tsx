"use client";

import { Input } from "@/components/shadcn/ui/input";
import {useRouter,useSearchParams,usePathname } from "next/navigation";
import { createPath } from "@/lib/utils/shared/pageParams";
export default function SearchBar(){
  const router = useRouter();
  const params = useSearchParams();

  // Uses path name it is already on...?
  const path = usePathname();


  const page = params.get('page') ?? '1';
  const checkedBoxes = params.get("checkedBoxes") ?? "";

  function handleSearch(user: string) {
    router.push(createPath(path,page,user,checkedBoxes));
  }

  return(
    <Input
    placeholder="Search for users"
    onChange={(e) => {
      handleSearch(e.target.value);
    }}
  />
  );
}