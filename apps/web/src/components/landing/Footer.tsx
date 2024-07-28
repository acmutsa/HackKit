"use client";

import { type FunctionComponent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, Twitter, Github, Disc } from "lucide-react";
import Discord from "../../../public/img/landing/discord_icon.svg";

interface Props {
	className?: string;
}

export default function Footer() {
	const [showResources, setShowResources] = useState(false);
	const [showLinks, setShowLinks] = useState(false);
	const [showHackathons, setShowHackathons] = useState(false);

	return (
    <section className="flex w-full items-center justify-center min-h-[25vh] border-t-2 border-muted-foreground">
      <h1 className="text-4xl md:text-5xl font-black"> Your Footer Here</h1>
    </section>
  );
}
