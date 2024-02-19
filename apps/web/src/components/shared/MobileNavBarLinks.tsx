import { getNavBarLinks } from "./NavBarLinksGrouper";

import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from "../shadcn/ui/dropdown-menu";
import Link from "next/link";
export default async function MobileNavBarLinks() {
    const navLinks = await getNavBarLinks();
    
  return (
    <div className="md:hidden cursor-pointer">
      <DropdownMenuSeparator />
      {navLinks.items.map((nav, key)=>{
        return(
            <div key={nav.name}>
            {
                nav.enabled ?
                    <Link href={nav.url}>
                        <DropdownMenuItem>
                            {nav.name}
                        </DropdownMenuItem>
                    </Link>
            :null
            }
            
            </div>
        )
      })}
      <DropdownMenuSeparator/>
    </div>
  );
}

export const runtime = "edge";
export const revalidate = 30;
