import { PublicLandingPage } from "@hackkit/ui";
import { getAuthSession } from "@/lib/auth";
import { publicSiteConfig } from "@/lib/public-site-config";

export const dynamic = "force-dynamic";

export default async function HomePage() {
	const session = await getAuthSession();
	const { signedInAction, ...landing } = publicSiteConfig.landing;

	return (
		<PublicLandingPage
			{...landing}
			primaryAction={session ? signedInAction : landing.primaryAction}
		/>
	);
}
