"use client";
import "../../app/globals.css";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function ShinyLogo() {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setIsLoaded(true);
		}, 100);
	}, []);

	return (
		<Image
			src="/img/logo/rhbttf.svg"
			alt="Logo"
			width={230}
			height={230}
			className={`card-shine-effect ${
				isLoaded && "card-shine-effect-active"
			}`}
		/>
	);
}
