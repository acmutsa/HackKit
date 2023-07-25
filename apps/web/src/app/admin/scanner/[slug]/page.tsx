"use client";

import { useState } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";

export default function Page() {
	const [data, setData] = useState("No result");
	const [error, setError] = useState("No error");
	return (
		<div>
			<h1>Scanner</h1>
			<div className="w-[500px] aspect-square overflow-hidden">
				<QrScanner
					onDecode={(result) => setData(result)}
					onError={(error) => console.log(error?.message)}
					containerStyle={{ width: "500px", margin: "0" }}
				/>
			</div>
			<p>{data}</p>
			<br />
			<p>{error}</p>
		</div>
	);
}
