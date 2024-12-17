"use client";

import { Button } from "@/components/shadcn/ui/button";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import { Switch } from "@/components/shadcn/ui/switch";
import { useOptimisticAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import {
	toggleRegistrationEnabled,
	toggleRegistrationMessageEnabled,
	toggleSecretRegistrationEnabled,
	toggleRSVPs,
	setRSVPLimit,
} from "@/actions/admin/registration-actions";
import { UpdateItemWithConfirmation } from "./UpdateItemWithConfirmation";

interface RegistrationTogglesProps {
	defaultRegistrationEnabled: boolean;
	defaultSecretRegistrationEnabled: boolean;
	defaultRSVPsEnabled: boolean;
	defaultRSVPLimit: number;
}

export function RegistrationToggles({
	defaultSecretRegistrationEnabled,
	defaultRegistrationEnabled,
	defaultRSVPsEnabled,
	defaultRSVPLimit,
}: RegistrationTogglesProps) {
	const {
		execute: executeToggleSecretRegistrationEnabled,
		optimisticState: ToggleSecretRegistrationEnabledOptimisticData,
	} = useOptimisticAction(toggleSecretRegistrationEnabled, {
		currentState: {
			success: true,
			statusSet: defaultSecretRegistrationEnabled,
		},
		updateFn: (state, { enabled }) => {
			return { statusSet: enabled, success: true };
		},
	});

	const {
		execute: executeToggleRSVPs,
		optimisticState: toggleRSVPsOptimisticData,
	} = useOptimisticAction(toggleRSVPs, {
		currentState: { success: true, statusSet: defaultRSVPsEnabled },
		updateFn: (state, { enabled }) => {
			return { statusSet: enabled, success: true };
		},
	});

	const {
		execute: executeToggleRegistrationEnabled,
		optimisticState: ToggleRegistrationEnabledOptimisticData,
	} = useOptimisticAction(toggleRegistrationEnabled, {
		currentState: { success: true, statusSet: defaultRegistrationEnabled },
		updateFn: (state, { enabled }) => {
			return { statusSet: enabled, success: true };
		},
	});

	const {
		execute: executeSetRSVPLimit,
		optimisticState: SetRSVPLimitOptimisticData,
	} = useOptimisticAction(setRSVPLimit, {
		currentState: { success: true, statusSet: defaultRSVPLimit },
		updateFn: (state, { rsvpLimit }) => {
			return { statusSet: rsvpLimit, success: true };
		},
	});

	return (
		<>
			<div className="rounded-lg border-2 border-muted px-5 py-10">
				<h2 className="pb-5 text-3xl font-semibold">Registration</h2>
				<div className="max-w-[500px]">
					<div className="flex items-center border-y border-y-muted py-4">
						<p className="text-sm font-bold">New Registrations</p>
						<Switch
							className="ml-auto"
							checked={
								ToggleRegistrationEnabledOptimisticData.statusSet
							}
							onCheckedChange={(checked) => {
								toast.success(
									`Registration ${checked ? "enabled" : "disabled"} successfully!`,
								);
								executeToggleRegistrationEnabled({
									enabled: checked,
								});
							}}
						/>
					</div>
					<div className="flex items-center border-b border-b-muted py-4">
						<p className="text-sm font-bold">
							Allow Secret Code Sign-up
						</p>
						<Switch
							className="ml-auto"
							checked={
								ToggleSecretRegistrationEnabledOptimisticData.statusSet
							}
							onCheckedChange={(checked) => {
								toast.success(
									`Secret registration ${checked ? "enabled" : "disabled"} successfully!`,
								);
								executeToggleSecretRegistrationEnabled({
									enabled: checked,
								});
							}}
						/>
					</div>
				</div>
			</div>
			<div className="mt-5 rounded-lg border-2 border-muted px-5 py-10">
				<h2 className="pb-5 text-3xl font-semibold">RSVPs</h2>
				<div className="max-w-[500px]">
					<div className="flex items-center border-t border-t-muted py-4">
						<p className="text-sm font-bold">Allow RSVPs</p>
						<Switch
							className="ml-auto"
							checked={toggleRSVPsOptimisticData.statusSet}
							onCheckedChange={(checked) => {
								toast.success(
									`RSVPs ${checked ? "enabled" : "disabled"} successfully!`,
								);
								executeToggleRSVPs({ enabled: checked });
							}}
						/>
					</div>
					<div className="flex items-center border-b border-t border-t-muted py-4">
						<p className="mr-auto text-sm font-bold">RSVP Limit</p>
						<UpdateItemWithConfirmation
							defaultValue={SetRSVPLimitOptimisticData.statusSet}
							enabled={toggleRSVPsOptimisticData.statusSet}
							type="number"
							onSubmit={(newLimit) => {
								toast.success(
									`Hacker RSVP limit successfully changed to ${newLimit}!`,
								);
								executeSetRSVPLimit({ rsvpLimit: newLimit });
							}}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
