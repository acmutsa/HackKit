import { useState } from "react";
import { Input } from "@/components/shadcn/ui/input";
import { Button } from "@/components/shadcn/ui/button";

interface UpdateItemWithConfirmationBaseProps<T extends number | string> {
	defaultValue: T;
	enabled: boolean;
	onSubmit: (value: T) => void;
}

type UpdateItemWithConfirmationProps =
	| ({ type: "string" } & UpdateItemWithConfirmationBaseProps<string>)
	| ({ type: "number" } & UpdateItemWithConfirmationBaseProps<number>);

export function UpdateItemWithConfirmation({
	type,
	defaultValue,
	onSubmit,
	enabled,
}: UpdateItemWithConfirmationProps) {
	const [valueUpdated, setValueUpdated] = useState(false);
	const [value, setValue] = useState(defaultValue.toString());

	return (
		<div className="flex max-h-8 items-center gap-2">
			<Input
				className="text-md w-24 text-center font-bold sm:w-40"
				value={value}
				disabled={!enabled}
				onChange={({ target: { value: updated } }) => {
					// Ignore the change if the value is a non numeric character.
					if (type === "number" && /[^0-9]/.test(updated)) {
						setValue(value);
						return;
					}

					setValue(updated);

					/* Avoid allowing the user to update the default value to itself.
					 * Also disallow the user from sending a zero length input. */
					setValueUpdated(
						updated !== defaultValue.toString() &&
							updated.length !== 0,
					);
				}}
			/>
			<Button
				className="text-sm font-bold"
				type="button"
				variant="default"
				title="Apply Changes"
				disabled={!valueUpdated || !enabled}
				onClick={() => {
					if (type === "number") {
						onSubmit(parseInt(value));
					} else {
						onSubmit(value);
					}

					setValueUpdated(false);
				}}
			>
				Apply
			</Button>
		</div>
	);
}
