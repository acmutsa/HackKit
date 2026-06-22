"use client";

import { useEffect } from "react";
import { mountLandingThread } from "@/lib/utils/client/thread";

export default function LandingThread() {
	useEffect(() => mountLandingThread(), []);
	return null;
}
