export default function TrailerSection() {
	return (
		<section
			className={
				"sm:p-8 md:px-10 flex min-h-[50vh] w-full items-center justify-center p-1 py-8"
			}
		>
			<div>
				<h1
					className={
						"to-orange600 sm:text-4xl mb-4 flex justify-center bg-gradient-to-b from-orange-600 via-yellow-300 bg-clip-text pl-0 pr-2 font-bttf text-4xl text-transparent"
					}
				>
					trailer
				</h1>
				<div className={"sm:w-[600px] lg:w-[1200px]"}>
					<div className={"sm:h-[315px] lg:h-[630px]"}>
						<iframe
							className={
								"h-full w-full rounded-lg border-4 border-black shadow-md"
							}
							src="https://www.youtube.com/embed/PYy2pXMuL4w?si=aRwACDtFnv9UalJF&rel=0"
							title="YouTube video player"
							frameBorder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							referrerPolicy="strict-origin-when-cross-origin"
							allowFullScreen
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
