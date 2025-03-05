import Link from "next/link";

// TODO: make this look better

export default function NotFound() {
	return (
		<div>
			<h2>Not Found</h2>
			<p>Could not find requested resource</p>
			<Link href="/">Return Home</Link>
		</div>
	);
}

export const runtime = "edge";
