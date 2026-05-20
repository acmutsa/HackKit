import { type User, type UserData, type UserDataOptions } from "@hackkit/core";
import { type UseFormReturn } from "react-hook-form";
import type { UserDataFormValues } from "../types";
export type { UserDataFormValues };
export type UserDataFormProps = {
	currentUser: User;
	userDataOptions: UserDataOptions;
	defaultValues?: Partial<UserDataFormValues> | null;
	successRedirectTo?: string;
	className?: string;
};
type FieldProps = {
	form: UseFormReturn<UserDataFormValues>;
	userDataOptions: UserDataOptions;
};
export declare function toUserDataFormDefaultValues(
	userData: UserData,
): UserDataFormValues;
export declare function UserDataFields({
	form,
	userDataOptions,
}: FieldProps): import("react/jsx-runtime").JSX.Element;
export declare function UserDataForm({
	currentUser,
	userDataOptions,
	defaultValues,
	successRedirectTo,
	className,
}: UserDataFormProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=user-data-form.d.ts.map
