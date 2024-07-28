export default async function Page() {
	return (
		<div className="rounded-lg border-border border-2 w-full min-h-[250px] p-5 space-y-3">
			<h2 className="font-semibold text-3xl">Toggles</h2>
			<p className="text-sm">
				Toggles allow you to control various dynamic options on the website. If you don't see an
				option here, chances are it can be changed in the <code>hackkit.config.ts</code> file or via
				enviroment variables. Visit the HackKit docs to learn more!
			</p>
		</div>
	);
}
