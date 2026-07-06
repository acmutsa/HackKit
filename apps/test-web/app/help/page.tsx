import { PublicHelpPage } from "@hackkit/ui";
import { publicSiteConfig } from "@/lib/public-site-config";

export default function HelpPage() {
	return (
		<PublicHelpPage
			title={publicSiteConfig.help.title}
			description={publicSiteConfig.help.description}
			contacts={publicSiteConfig.help.contacts}
			resources={publicSiteConfig.help.resources}
		/>
	);
}
