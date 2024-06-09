"use client";

import { Input } from "@/components/shadcn/ui/input";
import {useRouter,useSearchParams,usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";


import { X } from "lucide-react";
export default function SearchBar(){
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  // We use a debouncing strategy to prevent the search from querying every single keystroke and instead will run a time after the user completes typing
  const handleSearch = useDebouncedCallback((term) => {
    // @ts-ignore Works perfectly fine and is apprporiate accoriding to the docs. Might be a version issue?
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("user", term);
    } else {
      params.delete("user");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 100);

  return (
    <div className="flex items-center justify-center">
      {/* Needs to clear text */}
      <Input
        type="text"
        placeholder="Search for events"
        defaultValue={searchParams.get('user')?.toString()}
        className="bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <button
        onClick={() => {
          handleSearch("");
        }}>
        <X className="ml-4" />
      </button>
    </div>
  );
}