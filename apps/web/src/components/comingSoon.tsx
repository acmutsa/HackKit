import Image from "next/image";
import Link from "next/link";

type ComingSoonProps = {
	title?: string;
	description?: string;
};

export default function ComingSoon({
	title = "Coming Soon",
	description = "We’re still building this page. Check back soon.",
}: ComingSoonProps) {
	return (
		<main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 text-white">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.16),transparent_32%),linear-gradient(to_bottom,#04070d,#02040a)]" />
			<div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
			<div className="absolute left-1/2 top-[45%] h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-[120px]" />

			<section className="relative z-10 w-full max-w-4xl">
				<div className="grid overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl md:grid-cols-[1.05fr_0.95fr]">
					<div className="relative flex min-h-[420px] flex-col justify-center p-8 md:p-10">
						<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_30%)]" />

						<div className="relative z-10">
							<h1 className="max-w-xl text-6xl font-semibold tracking-tight">
								{title}
							</h1>

							<p className="mt-5 max-w-lg text-base leading-7 text-white/65 sm:text-lg">
								{description}
							</p>

							<div className="mt-8">
								<Link
                                    href="/"
                                    className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur transition-all hover:border-white/25 hover:bg-white/10"
                                >
                                    Back to Home
                                </Link>
							</div>
						</div>
					</div>

					<div className="relative flex min-h-[320px] flex-col items-center justify-center p-10 md:min-h-[420px]">
						<div className="absolute h-56 w-56 rounded-full bg-blue-500/25 blur-[90px]" />
						<div className="relative z-10 flex flex-col items-center text-center">
							<Image
								src="/img/logo/hackkit.svg"
								alt="HackKit Logo"
								width={110}
								height={110}
								className="opacity-95"
							/>

							<p className="mt-6 max-w-xs text-sm leading-6 text-white/55">
								This page is temporarily unavailable while setup is in progress.
							</p>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}