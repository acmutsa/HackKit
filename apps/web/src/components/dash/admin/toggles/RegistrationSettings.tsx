"use client";

import { Button } from "@/components/shadcn/ui/button";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import { Switch } from "@/components/shadcn/ui/switch";
import { useOptimisticAction } from "next-safe-action/hook";
import { toast } from "sonner";
import {
	toggleRegistrationEnabled,
	toggleRegistrationMessageEnabled,
	toggleSecretRegistrationEnabled,
} from "@/actions/admin/registration-actions";

interface RegistrationTogglesProps {
	defaultRegistrationEnabled: boolean;
	defaultSecretRegistrationEnabled: boolean;
}

export function RegistrationToggles({
	defaultSecretRegistrationEnabled,
	defaultRegistrationEnabled,
}: RegistrationTogglesProps) {
	const {
		execute: executeToggleSecretRegistrationEnabled,
		optimisticData: ToggleSecretRegistrationEnabledOptimisticData,
	} = useOptimisticAction(
		toggleSecretRegistrationEnabled,
		{ success: true, statusSet: defaultSecretRegistrationEnabled },
		(state, { enabled }) => {
			return { statusSet: enabled, success: true };
		}
	);
	const {
		execute: executeToggleRegistrationEnabled,
		optimisticData: ToggleRegistrationEnabledOptimisticData,
	} = useOptimisticAction(
		toggleRegistrationEnabled,
		{ success: true, statusSet: defaultRegistrationEnabled },
		(state, { enabled }) => {
			return { statusSet: enabled, success: true };
		}
	);

	return (
		<div className="border-2 border-muted rounded-lg py-10 px-5">
			<h2 className="font-semibold text-3xl pb-5">Registration</h2>
			<div className="max-w-[500px]">
				<div className="flex items-center py-4 border-y-muted border-y">
					<p className="text-sm font-bold">New Registrations</p>
					<Switch
						className="ml-auto"
						checked={ToggleRegistrationEnabledOptimisticData.statusSet}
						onCheckedChange={(checked) => {
							toast.success(`Registration ${checked ? "enabled" : "disabled"} successfully!`);
							executeToggleRegistrationEnabled({ enabled: checked });
						}}
					/>
				</div>
				<div className="flex items-center py-4 border-b-muted border-b">
					<p className="text-sm font-bold">Allow Secret Code Sign-up</p>
					<Switch
						className="ml-auto"
						checked={ToggleSecretRegistrationEnabledOptimisticData.statusSet}
						onCheckedChange={(checked) => {
							toast.success(
								`Secret registration ${checked ? "enabled" : "disabled"} successfully!`
							);
							executeToggleSecretRegistrationEnabled({ enabled: checked });
						}}
					/>
				</div>
			</div>
		</div>
	);
}
