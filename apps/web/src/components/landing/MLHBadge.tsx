import Link from "next/link";
import Image from "next/image";

export default function MLHBadge() {
	return (
		<>
			<div className="relative hidden h-0 w-full dark:block">
				<Link
					id="mlh-trust-badge"
					className="absolute right-5 top-0 z-50 w-[10%] min-w-[60px] max-w-[100px]"
					// style="display:block;max-width:100px;min-width:60px;position:fixed;right:50px;top:0;width:10%;z-index:10000"
					href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2025-season&utm_content=black"
					target="_blank"
				>
					<Image
						src="https://s3.amazonaws.com/logged-assets/trust-badge/2025/mlh-trust-badge-2025-black.svg"
						alt="Major League Hacking 2025 Hackathon Season"
						width={0}
						height={0}
						className="aspect-auto h-auto w-full"
						style={{ width: "100%" }}
					/>
				</Link>
			</div>
			<div className="relative block h-0 w-full dark:hidden">
				<Link
					id="mlh-trust-badge"
					className="absolute right-5 top-0 z-50 w-[10%] min-w-[60px] max-w-[100px]"
					// style="display:block;max-width:100px;min-width:60px;position:fixed;right:50px;top:0;width:10%;z-index:10000"
					href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2025-season&utm_content=white"
					target="_blank"
				>
					<Image
						src="https://s3.amazonaws.com/logged-assets/trust-badge/2025/mlh-trust-badge-2025-white.svg"
						alt="Major League Hacking 2025 Hackathon Season"
						width={0}
						height={0}
						className="aspect-auto h-auto w-full"
						style={{ width: "100%" }}
					/>
				</Link>
			</div>
		</>
	);
}
