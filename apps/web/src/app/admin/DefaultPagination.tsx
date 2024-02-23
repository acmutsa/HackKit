"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/shadcn/ui/pagination";
import { useEffect, useRef, useState } from "react";
import {usePathname,useSearchParams } from "next/navigation";
import { createPath } from "@/lib/utils/shared/pageParams";

export function DefaultPagination({maxPages}:{maxPages:number}) {
  // FIXME: Come back and change after done testing
  
  const path = usePathname();
  const params = useSearchParams();

  const user = params.get('user') ?? '';
  const page = params.get("page") ?? "1";
  const checkedBoxes = params.get("checkedBoxes") ?? "";


  const [currPage,setCurrPage] = useState(+page);
  const pageRef = useRef(1);

  
  function incPage(){
    pageRef.current = Math.min(maxPages,pageRef.current + 1);
    setCurrPage(Math.min(maxPages,currPage+1));
  }

  function decPage() {
    pageRef.current = Math.max(1, pageRef.current - 1);
    setCurrPage(Math.max(1, currPage - 1));
  }

  useEffect(()=>{

    console.log("Curr page is:",currPage);
  },[currPage]);


  // `${path}?page=${Math.max(
            //   1,
            //   pageRef.current - 1
            // )}&user=${user}`

  return (
    <Pagination className="pt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createPath(
              path,
              `${Math.max(1, pageRef.current - 1)}`,
              user,
              checkedBoxes
            )}
            onClick={() => {
              decPage();
            }}
          />
        </PaginationItem>
        {currPage}
        <PaginationItem>
          <PaginationNext
            // 
            href={createPath(path,`${Math.min(maxPages,pageRef.current + 1)}`,user,checkedBoxes)}
            onClick={() => {
              incPage();
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
