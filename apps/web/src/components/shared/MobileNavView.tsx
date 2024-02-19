"use client";

import Link from "next/link";
import { Button } from "../shadcn/ui/button";
import ProfileButton from "../dash/shared/ProfileButton";

import NavBarLinksGrouper from "./NavBarLinksGrouper";


//     <div className="fixed top-0 w-screen h-16 bg-nav z-50 border-b-border border-b">
//         <div className="items-center justify-end gap-x-4 md:flex hidden">
//           {user ? (
//             <>
//               <Link
//                 href={
//                   user.publicMetadata.registrationComplete
//                     ? "/dash"
//                     : "/register"
//                 }>
//                 <Button
//                   variant={"outline"}
//                   className="bg-nav hover:bg-background">
//                   {user.publicMetadata.registrationComplete
//                     ? "Dashboard"
//                     : "Complete Registration"}
//                 </Button>
//               </Link>
//               <ProfileButton />
//             </>
//           ) : (
//             <>
//               <Link href={"/sign-in"}>
//                 <Button
//                   variant={"outline"}
//                   className="bg-nav hover:bg-background">
//                   Sign In
//                 </Button>
//               </Link>
//               <Link href={"/register"}>
//                 <Button>Register</Button>
//               </Link>
//             </>
//           )}
//         </div>
//       </div>
//   );
// }

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu";


export default function MobileNavView({userName,userRegistered}:{userName?:string |null,userRegistered?:boolean | null}) {
  // This needs to take a client as an argument
  
  
  // Personally, I would like to have the dropdown trigger as the little menu piece instead
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="md:hidden">
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        {/* Make this depend on our user data */}
        <DropdownMenuLabel>Welcome, {userName ? userName : "Please Sign In"}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        
        
        <DropdownMenuItem>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export const runtime = "edge";
