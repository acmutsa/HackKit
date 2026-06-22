"use client";

import { useFormContext } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/shadcn/ui/button";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/shadcn/ui/form";

import FormGroupWrapper from "../FormGroupWrapper";
import { hackerRegistrationFormValidator } from "@/validators/shared/registration";
import { formatRegistrationField } from "@/lib/utils/client/shared";
import type { SectionProps } from "../RegisterForm";

type FormData = z.infer<typeof hackerRegistrationFormValidator>;

export default function Resume({
	uploadedFile,
	setUploadedFile,
	getRootProps,
	getInputProps,
	isDragActive,
}: SectionProps) {
	const form = useFormContext<FormData>();

	return (
		<FormGroupWrapper title="Resume">
			<FormField
				name={"resume" as any}
				control={form.control}
				render={() => (
					<FormItem>
						<FormLabel>
							{formatRegistrationField("Resume", true)}
						</FormLabel>

						<FormControl>
							<div
								{...getRootProps()}
								className={`border-2${uploadedFile ? "" : " cursor-pointer"} flex min-h-[200px] flex-col items-center justify-center rounded-lg border-dashed border-white`}
							>
								<input type="file" {...getInputProps()} />

								<p className="p-2 text-center">
									{uploadedFile
										? `${uploadedFile.name} (${Math.round(uploadedFile.size / 1024)}kb)`
										: isDragActive
											? "Drop your resume here..."
											: "Drag 'n' drop your resume here, or click to select a file"}
								</p>

								{uploadedFile && (
									<Button
										type="button"
										className="mt-4"
										onClick={() => setUploadedFile(null)}
									>
										Remove
									</Button>
								)}
							</div>
						</FormControl>

						<FormMessage />
					</FormItem>
				)}
			/>
		</FormGroupWrapper>
	);
}