"use client";

import { Input } from "@/components/shadcn/ui/input";
import {useRouter,useSearchParams,usePathname } from "next/navigation";
import { useRef, useState } from "react";

import { X } from "lucide-react";
export default function SearchBar(){
  const router = useRouter();
  const params = useSearchParams();


  // Uses path name it is already on...?
  const path = usePathname();
  const user = params.get("user") ?? "";
  const [input,setInput] = useState("");

  const checkedBoxes = params.get("checkedBoxes") ?? "";

  function handleSearch(user: string) {
    const url = `${path}?page=1&user=${user}&checkedBoxes=${checkedBoxes}`;
    setInput(user);
    console.log("searchbar",url);
    router.push(url);
  }

  return (
    <div className="flex items-center justify-center">
      {/* Needs to clear text */}
      <Input
        placeholder="Search for users"
        value={input}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        // Render a little x here to clear out the stuff
      />
      <button
      
       onClick={()=>{
        setInput("");
        const url = `${path}`
        router.push(url);
      }}>
        <X className="ml-4"/>
      </button>
    </div>
  );
}