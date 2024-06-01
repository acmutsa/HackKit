"use client";
import * as React from "react";
import { MinusIcon,PlusIcon } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import QRCode from "react-qr-code";
import { Button } from "@/components/shadcn/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/shadcn/ui/drawer";

export default function FullScreenQR({QRstring}:{QRstring:string}){
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <QRCode
          className="h-full"
          bgColor="hsl(var(--background))"
          fgColor="hsl(var(--primary))"
          value={QRstring}
        />
      </DrawerTrigger>
      <DrawerContent className="flex items-center justify-center w-full h-[90%] ">
        <QRCode
          className="h-full"
          bgColor="hsl(var(--background))"
          fgColor="hsl(var(--primary))"
          value={QRstring}
        />
      </DrawerContent>
    </Drawer>
  );
}
