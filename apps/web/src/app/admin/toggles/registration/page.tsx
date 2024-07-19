import { RegistrationToggles } from "@/components/admin/toggles/RegistrationSettings";
import { kv } from "@vercel/kv";
import { parseRedisBoolean } from "@/lib/utils/server/redis";

export default async function Page() {
	const pipe = kv.pipeline();
	pipe.get("config:registration:registrationEnabled");
	pipe.get("config:registration:secretRegistrationEnabled");
	// const result = await pipe.exec();

	const [
		defaultRegistrationEnabled,
		defaultSecretRegistrationEnabled,
		defaultRSVPsEnabled,
	]: (string | null)[] = await kv.mget(
		"config:registration:registrationEnabled",
		"config:registration:secretRegistrationEnabled",
		"config:registration:allowRSVPs",
	);

	return (
		<div>
			<div className="flex items-center justify-start pb-10">
				<h2 className="text-3xl font-bold tracking-tight">
					Registration & Sign-in
				</h2>
			</div>
			<RegistrationToggles
				defaultRegistrationEnabled={parseRedisBoolean(
					defaultRegistrationEnabled,
					true,
				)}
				defaultSecretRegistrationEnabled={parseRedisBoolean(
					defaultSecretRegistrationEnabled,
					false,
				)}
				defaultRSVPsEnabled={parseRedisBoolean(
					defaultRSVPsEnabled,
					true,
				)}
			/>
		</div>
	);
}

export const runtime = "edge";
