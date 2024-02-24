"use client"

import {
  AccordionContent,
} from "@/components/shadcn/ui/accordion";

import { Checkbox } from "@/components/shadcn/ui/checkbox";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import { createPath } from "@/lib/utils/shared/pageParams";


export default function FilterItem({parentName,item}:{parentName:string,item:string}){
    const isClicked = useRef(false);
    const path = usePathname();
    const params = useSearchParams();
    const router = useRouter();
    

    function handleClick(){
        if (isClicked.current) {
          isClicked.current = false;
          // router.push(createPath(path, '1', user, checkedBoxes));
          
          const url = `${path}?${params}`;
          console.log("Flipping off!");
          router.push(url);
        } else {
          isClicked.current = true;
          console.log("Flipping on!");
          const user = params.get("user") ?? "";
          const checkedBoxes = params.get("checkedBoxes") ?? [];
          // We want to filter basically 
          
          const url = `${path}?user=${user}&checkedBoxes=${item}`;
          console.log("Filter item",url);
          router.push(url);
        }
    }

      
    return(
        <AccordionContent>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={item}
          onClick={handleClick}
        />
        <h3>{item}</h3>
      </div>
    </AccordionContent>
    )
}