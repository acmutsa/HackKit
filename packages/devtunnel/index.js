import localtunnel from "localtunnel";
import { publicIpv4 } from "public-ip";

(async () => {
	console.log("🌐 Opening Tunnel");
	const tunnel = await localtunnel({ port: 3000 });
	console.log(`🔗 Tunnel Opened at ${tunnel.url}`);
	console.log(`🛜  Your public IP address is: ${await publicIpv4()}`);

	tunnel.on("close", () => {
		console.log("🔒 Tunnel Closed");
		process.exit(0);
	});
})();
