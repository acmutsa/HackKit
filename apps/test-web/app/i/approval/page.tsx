import Link from "next/link";

export default function ApprovalPendingPage() {
	return (
		<main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
			<div className="space-y-4 rounded-lg border bg-card p-8 shadow-sm">
				<p className="text-sm font-medium text-primary">
					Registration received
				</p>
				<h1 className="text-3xl font-bold tracking-tight">
					Your account is awaiting approval.
				</h1>
				<p className="text-muted-foreground">
					Organizers are reviewing your registration. Once approved,
					you can access participant features like your Event Pass,
					teams, and RSVP.
				</p>
				<Link
					href="/dashboard"
					className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
				>
					Back to dashboard
				</Link>
			</div>
		</main>
	);
}
