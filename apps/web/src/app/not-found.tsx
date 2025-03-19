import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex h-screen w-screen items-center justify-center bg-white dark:bg-black">
			<div className="text-center">
				<h1 className="mb-4 text-9xl font-extrabold text-hackathon dark:text-primary">
					404
				</h1>
				<h2 className="mb-4 text-4xl font-bold">Page Not Found</h2>
				<p className="mb-8 text-lg">
					The page you are looking for does not exist.
				</p>
				<Link href="/" className="text-lg text-blue-500 underline">
					Return to Home
				</Link>
			</div>
		</div>
	);
}

export const runtime = "edge";
