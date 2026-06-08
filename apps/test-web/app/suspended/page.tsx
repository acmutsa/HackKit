export default function SuspendedPage() {
	return (
		<main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
			<div className="space-y-4 rounded-lg border bg-card p-8 shadow-sm">
				<p className="text-sm font-medium text-destructive">
					Account suspended
				</p>
				<h1 className="text-3xl font-bold tracking-tight">
					Your access to this HackKit app is suspended.
				</h1>
				<p className="text-muted-foreground">
					If you think this is a mistake, contact the organizing team
					for help.
				</p>
			</div>
		</main>
	);
}
