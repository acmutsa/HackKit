export default async function Page() {
	return (
		<div className="min-h-[250px] w-full space-y-3 rounded-lg border-2 border-border p-5">
			<h2 className="text-3xl font-semibold">Toggles</h2>
			<p className="text-sm">
				Toggles allow you to control various dynamic options on the
				website. If you don't see an option here, chances are it can be
				changed in the <code>hackkit.config.ts</code> file or via
				enviroment variables. Visit the HackKit docs to learn more!
			</p>
		</div>
	);
}
