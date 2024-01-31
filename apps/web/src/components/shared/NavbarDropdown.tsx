"use client";
import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/shadcn/ui/navigation-menu";
import Link from "next/link";
import { Button } from "../shadcn/ui/button";

type Props = {};

function NavbarDropdown({}: Props) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>Help Out</NavigationMenuTrigger>
      <NavigationMenuContent>
        <Link
          className="w-full"
          href={process.env.NEXT_PUBLIC_VOLUNTEER_FORM_URL ?? "/not-found"}
        >
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Volunteer
          </NavigationMenuLink>
        </Link>

        <Link
          className="w-full"
          href={process.env.NEXT_PUBLIC_MENTOR_FORM_URL ?? "/not-found"}
        >
          <NavigationMenuLink
            className={`w-full grow ${navigationMenuTriggerStyle()}`}
          >
            Mentor
          </NavigationMenuLink>
        </Link>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

export default NavbarDropdown;
