"use client";

import * as React from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

function jsonReplacer(_key: string, value: unknown) {
	if (typeof value === "number" && !Number.isFinite(value)) {
		return undefined;
	}
	return value;
}

export function usePersistedFormState<TValues extends FieldValues>(
	form: UseFormReturn<TValues>,
	storageKey?: string,
) {
	const [hydrated, setHydrated] = React.useState(false);

	React.useEffect(() => {
		if (!storageKey) {
			setHydrated(true);
			return;
		}

		try {
			const stored = window.localStorage.getItem(storageKey);
			if (stored) {
				const values = JSON.parse(stored) as Partial<TValues>;
				form.reset({ ...form.getValues(), ...values });
			}
		} catch {
			// Ignore invalid or unavailable localStorage state.
		} finally {
			setHydrated(true);
		}
	}, [form, storageKey]);

	React.useEffect(() => {
		if (!storageKey || !hydrated) return;

		const subscription = form.watch((values) => {
			try {
				window.localStorage.setItem(
					storageKey,
					JSON.stringify(values, jsonReplacer),
				);
			} catch {
				// Ignore quota/security errors; form submission still works.
			}
		});

		return () => subscription.unsubscribe();
	}, [form, hydrated, storageKey]);

	return React.useCallback(() => {
		if (!storageKey) return;
		try {
			window.localStorage.removeItem(storageKey);
		} catch {
			// Ignore unavailable localStorage.
		}
	}, [storageKey]);
}
