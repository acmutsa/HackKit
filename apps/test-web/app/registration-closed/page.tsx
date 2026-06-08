import Link from "next/link";

export default function RegistrationClosedPage() {
	return (
		<main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
			<div className="space-y-4 rounded-lg border bg-card p-8 shadow-sm">
				<p className="text-sm font-medium text-primary">
					Registration closed
				</p>
				<h1 className="text-3xl font-bold tracking-tight">
					New hacker registrations are closed.
				</h1>
				<p className="text-muted-foreground">
					If you have already started registration, sign in to check
					your current status or contact the organizing team.
				</p>
				<Link
					href="/dashboard"
					className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
				>
					Go to dashboard
				</Link>
			</div>
		</main>
	);
}
