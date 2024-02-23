"use client";

import { Input } from "@/components/shadcn/ui/input";
import {useRouter,useSearchParams,usePathname } from "next/navigation";

export default function SearchBar(){
  const router = useRouter();
  const params = useSearchParams();
  const path = usePathname();


  const page = params.get('page') ?? '1';

  function handleSearch(user: string) {
    router.push(`${path}?page=${page}&user=${user}`);
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