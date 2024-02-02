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
          href="https://form.rowdyhacks.org/volunteer"
          passHref
          legacyBehavior
        >
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Volunteer
          </NavigationMenuLink>
        </Link>

        <Link
          className="w-full"
          href="https://form.rowdyhacks.org/volunteer"
          passHref
          legacyBehavior
        >
          <NavigationMenuLink
            className={`w-auto ${navigationMenuTriggerStyle()}`}
          >
            Mentor
          </NavigationMenuLink>
        </Link>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

export default NavbarDropdown;
