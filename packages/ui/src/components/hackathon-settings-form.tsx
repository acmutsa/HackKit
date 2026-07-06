"use client";

import * as React from "react";
import { toast } from "sonner";
import { cn } from "../lib/cn";
import { useHackKitUI } from "../provider";
import type { HackathonSettingsFormProps } from "../types";
import type { ResolvedHackathonSetting, SettingKey } from "@hackkit/core";
import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type FormValue = boolean | string;
type FormState = Record<string, FormValue>;

function toFormState(settings: readonly ResolvedHackathonSetting[]): FormState {
	return Object.fromEntries(
		settings.map((setting) => [
			setting.key,
			setting.type === "number"
				? String(setting.value)
				: Boolean(setting.value),
		]),
	) as FormState;
}

function groupSettings(settings: readonly ResolvedHackathonSetting[]) {
	const groups = new Map<string, ResolvedHackathonSetting[]>();
	for (const setting of settings) {
		const category = setting.category ?? "General";
		groups.set(category, [...(groups.get(category) ?? []), setting]);
	}
	return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}

function parseNumberSetting(
	setting: ResolvedHackathonSetting,
	value: FormValue,
) {
	if (
		setting.type !== "number" ||
		typeof value !== "string" ||
		value.trim() === ""
	) {
		return null;
	}
	const parsed = Number(value);
	if (!Number.isFinite(parsed)) return null;
	if (setting.integer && !Number.isInteger(parsed)) return null;
	if (setting.min !== undefined && parsed < setting.min) return null;
	if (setting.max !== undefined && parsed > setting.max) return null;
	return parsed;
}

function toSettingPayloadValue(
	setting: ResolvedHackathonSetting,
	value: FormValue,
) {
	return setting.type === "number"
		? parseNumberSetting(setting, value)
		: value;
}

export function HackathonSettingsForm({
	settings,
	className,
}: HackathonSettingsFormProps) {
	const { actions } = useHackKitUI();
	const [currentSettings, setCurrentSettings] = React.useState(settings);
	const [values, setValues] = React.useState<FormState>(() =>
		toFormState(settings),
	);
	const [isSaving, setIsSaving] = React.useState(false);
	const [resettingKey, setResettingKey] = React.useState<SettingKey | null>(
		null,
	);

	const defaults = React.useMemo(
		() => toFormState(currentSettings),
		[currentSettings],
	);
	const invalidNumberKeys = currentSettings
		.filter(
			(setting) =>
				setting.type === "number" &&
				parseNumberSetting(setting, values[setting.key]) === null,
		)
		.map((setting) => setting.key);
	const dirtyUpdates = currentSettings
		.map((setting) => ({
			key: setting.key,
			value: toSettingPayloadValue(setting, values[setting.key]),
			defaultValue: toSettingPayloadValue(setting, defaults[setting.key]),
		}))
		.filter(
			(
				update,
			): update is {
				key: SettingKey;
				value: boolean | number;
				defaultValue: boolean | number;
			} => update.value !== null && update.value !== update.defaultValue,
		);
	const hasDirty = dirtyUpdates.length > 0;
	const hasInvalidNumbers = invalidNumberKeys.length > 0;

	function updateSettingInState(updated: ResolvedHackathonSetting) {
		setCurrentSettings((existing) =>
			existing.map((setting) =>
				setting.key === updated.key ? updated : setting,
			),
		);
		setValues((existing) => ({
			...existing,
			[updated.key]:
				updated.type === "number"
					? String(updated.value)
					: Boolean(updated.value),
		}));
	}

	async function saveChanges() {
		if (!hasDirty || hasInvalidNumbers) return;
		setIsSaving(true);
		const result = await actions.setSettings(
			dirtyUpdates.map((update) => ({
				key: update.key,
				value: update.value,
			})),
		);
		setIsSaving(false);
		if (!result.ok) {
			toast.error(result.message);
			return;
		}
		setCurrentSettings((existing) =>
			existing.map(
				(setting) =>
					result.data.find(
						(updated) => updated.key === setting.key,
					) ?? setting,
			),
		);
		toast.success("Settings saved.");
	}

	async function resetSetting(setting: ResolvedHackathonSetting) {
		setResettingKey(setting.key);
		const result = await actions.resetSetting(setting.key);
		setResettingKey(null);
		if (!result.ok) {
			toast.error(result.message);
			return;
		}
		updateSettingInState(result.data);
		toast.success(`${setting.label} reset to default.`);
	}

	return (
		<div className={cn("space-y-6", className)}>
			{groupSettings(currentSettings).map(
				([category, categorySettings]) => (
					<Card key={category}>
						<CardHeader>
							<CardTitle>{category}</CardTitle>
							<CardDescription>
								Manage {category.toLowerCase()} settings.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-5">
							{categorySettings.map((setting) => (
								<div
									key={setting.key}
									className="grid gap-2 rounded-md border p-4 md:grid-cols-[1fr_auto] md:items-center"
								>
									<div className="space-y-1">
										<Label htmlFor={setting.key}>
											{setting.label}
										</Label>
										<p className="text-sm text-muted-foreground">
											{setting.description}
										</p>
										{setting.type === "number" &&
										setting.unit ? (
											<p className="text-xs text-muted-foreground">
												Unit: {setting.unit}
											</p>
										) : null}
									</div>
									<div className="flex items-center gap-3">
										{setting.type === "boolean" ? (
											<Checkbox
												id={setting.key}
												checked={Boolean(
													values[setting.key],
												)}
												onCheckedChange={(checked) =>
													setValues((existing) => ({
														...existing,
														[setting.key]:
															checked === true,
													}))
												}
											/>
										) : (
											<Input
												id={setting.key}
												type="number"
												className="w-40"
												value={String(
													values[setting.key] ?? "",
												)}
												min={setting.min}
												max={setting.max}
												step={
													setting.integer
														? 1
														: undefined
												}
												onChange={(event) => {
													const value =
														event.currentTarget
															.value;
													setValues((existing) => ({
														...existing,
														[setting.key]: value,
													}));
												}}
											/>
										)}
										<Button
											type="button"
											variant="outline"
											disabled={
												resettingKey === setting.key ||
												setting.isDefault
											}
											onClick={() =>
												resetSetting(setting)
											}
										>
											Reset
										</Button>
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				),
			)}
			<div className="flex justify-end">
				<Button
					type="button"
					disabled={!hasDirty || hasInvalidNumbers || isSaving}
					onClick={saveChanges}
				>
					{isSaving ? "Saving..." : "Save Changes"}
				</Button>
			</div>
		</div>
	);
}
