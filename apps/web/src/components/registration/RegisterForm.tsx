"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useAction } from "next-safe-action/hooks";
import type { FileRejection } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import z from "zod";
import c, { staticUploads } from "config";

import { Button } from "@/components/shadcn/ui/button";
import CreatingRegistration from "./CreatingRegistration";
import RegistrationFeedbackAlert from "./RegistrationFeedbackAlert";

import {
	hackerRegistrationFormValidator,
	hackerRegistrationValidatorLocalStorage,
	hackerRegistrationResumeValidator,
} from "@/validators/shared/registration";
import {
	HACKER_REGISTRATION_RESUME_STORAGE_KEY,
	HACKER_REGISTRATION_STORAGE_KEY,
	NOT_LOCAL_SCHOOL,
} from "@/lib/constants";
import type {
	EthnicityOptionsType,
	GenderOptionsType,
	HeardFromOptionsType,
	LevelOfStudyOptionsType,
	MajorOptionsType,
	RaceOptionsType,
	SchoolOptionsType,
	ShirtSizeOptionsType,
	SoftwareExperienceOptionsType,
} from "@/lib/types/user";
import { encodeFileAsBase64, decodeBase64AsFile } from "@/lib/utils/shared/files";
import { useDebouncedCallback } from "use-debounce";
import { put } from "@/lib/utils/client/file-upload";
import { registerHacker } from "@/actions/registration";
import type { Tag } from "@/components/shadcn/ui/tag/tag-input";

// sections (adjust paths/names to match your project)
import PersonalInfo from "./sections/PersonalInfo";
import Education from "./sections/Education";
import Experience from "./sections/Experience";
import HackDay from "./sections/HackDay";
import CareerInfo from "./sections/CareerInfo";
import HackerProfile from "./sections/HackerProfile";
import Resume from "./sections/Resume";
import MLH from "./sections/MLH";

export type FormData = z.infer<typeof hackerRegistrationFormValidator>;

export type SectionProps = {
	uploadedFile: File | null;
	setUploadedFile: (f: File | null) => void;

	skills: Tag[];
	setSkills: (tags: Tag[]) => void;

	getRootProps: ReturnType<typeof useDropzone>["getRootProps"];
	getInputProps: ReturnType<typeof useDropzone>["getInputProps"];
	isDragActive: boolean;
};

type SectionDef = {
	id: string;
	title: string;
	fields: (keyof FormData)[];
	render: (props: SectionProps) => JSX.Element;
};

export default function RegisterForm({ defaultEmail }: { defaultEmail: string }) {
	const router = useRouter();
	const { isLoaded: isAuthLoaded } = useAuth();

	const [isLoading, setIsLoading] = useState(false);
	const [hasSuccess, setHasSuccess] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [skills, _setSkills] = useState<Tag[]>([]);

	// wrap setter to satisfy section prop typing
	const setSkills = (tags: Tag[]) => _setSkills(tags);

	const form = useForm<FormData>({
		resolver: zodResolver(hackerRegistrationFormValidator),
		mode: "onSubmit",
		reValidateMode: "onSubmit",
		defaultValues: {
			hackathonsAttended: 0,
			dietRestrictions: [],
			isSearchable: false,
			bio: "",
			isEmailable: false,
			hasAcceptedMLHCoC: false,
			hasSharedDataWithMLH: false,
			accommodationNote: "",
			firstName: "",
			lastName: "",
			age: 0,
			ethnicity: "" as EthnicityOptionsType,
			gender: "" as GenderOptionsType,
			major: "" as MajorOptionsType,
			GitHub: "",
			hackerTag: "",
			heardFrom: "" as HeardFromOptionsType,
			levelOfStudy: "" as LevelOfStudyOptionsType,
			LinkedIn: "",
			PersonalWebsite: "",
			discord: "",
			pronouns: "",
			race: "" as RaceOptionsType,
			shirtSize: "" as ShirtSizeOptionsType,
			schoolID: "",
			university: "" as SchoolOptionsType,
			phoneNumber: "",
			countryOfResidence: "",
			softwareExperience: "" as SoftwareExperienceOptionsType,
			email: defaultEmail,
			skills: [],
		},
	});

	// --- localStorage hydrate (form fields)
	useEffect(() => {
		const raw = localStorage.getItem(HACKER_REGISTRATION_STORAGE_KEY);
		if (!raw) return;

		try {
			const parsed = JSON.parse(raw);
			const res = hackerRegistrationValidatorLocalStorage.safeParse(parsed);
			if (!res.success) return;

			const {
				ethnicity,
				gender,
				major,
				university,
				dietRestrictions,
				heardFrom,
				softwareExperience,
				levelOfStudy,
				race,
				skills: savedSkills,
				shirtSize,
				...rest
			} = res.data;

			setSkills(savedSkills as Tag[]);
			form.reset({
				...form.formState.defaultValues,
				...rest,
				ethnicity: ethnicity as EthnicityOptionsType,
				race: race as RaceOptionsType,
				gender: gender as GenderOptionsType,
				university: university as SchoolOptionsType,
				shirtSize: shirtSize as ShirtSizeOptionsType,
				major: major as MajorOptionsType,
				levelOfStudy: levelOfStudy as LevelOfStudyOptionsType,
				softwareExperience: softwareExperience as SoftwareExperienceOptionsType,
				heardFrom: heardFrom as HeardFromOptionsType,
				dietRestrictions:
					dietRestrictions as (typeof c.registration.dietaryRestrictionOptions)[number][],
				skills: savedSkills as Tag[],
			});
		} catch {
			// ignore
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// --- localStorage hydrate (resume)
	useEffect(() => {
		const raw = localStorage.getItem(HACKER_REGISTRATION_RESUME_STORAGE_KEY);
		if (!raw) return;

		try {
			const parsed = JSON.parse(raw);
			const res = hackerRegistrationResumeValidator.safeParse(parsed);
			if (!res.success) return;

			const { fileString, fileName } = res.data;
			decodeBase64AsFile(fileString, fileName).then((file) => setUploadedFile(file));
		} catch {
			// ignore
		}
	}, []);

	// --- debounced localStorage write (no validation)
	const debouncedWrite = useDebouncedCallback(() => {
		localStorage.setItem(HACKER_REGISTRATION_STORAGE_KEY, JSON.stringify(form.getValues()));
	}, 750);

	useEffect(() => {
		const sub = form.watch(() => debouncedWrite());
		return () => sub.unsubscribe();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form.watch]);

	// --- dropzone
	const onDrop = useCallback(async (acceptedFiles: File[], rejections: FileRejection[]) => {
		if (rejections.length > 0) {
			alert(`The file was rejected: "${rejections[0].errors[0].message}"`);
			return;
		}
		if (acceptedFiles.length === 0) return;

		const file = acceptedFiles[0];
		setUploadedFile(file);

		localStorage.setItem(
			HACKER_REGISTRATION_RESUME_STORAGE_KEY,
			JSON.stringify({
				fileName: file.name,
				fileString: await encodeFileAsBase64(file),
			}),
		);
	}, []);

	const dropzone = useDropzone({
		onDrop,
		multiple: false,
		accept: { "application/pdf": [".pdf"] },
		maxSize: c.maxResumeSizeInBytes,
		noClick: uploadedFile != null,
		noDrag: uploadedFile != null,
	});

	// --- dynamic schoolID logic (same as your OG)
	const universityValue = form.watch("university");
	const classificationValue = form.watch("levelOfStudy");

	useEffect(() => {
		if (
			(universityValue && universityValue !== c.localUniversityName) ||
			classificationValue === "Recent Grad"
		) {
			form.setValue("schoolID", NOT_LOCAL_SCHOOL, { shouldDirty: true });
		} else {
			form.setValue("schoolID", form.getValues("schoolID") ?? "", { shouldDirty: true });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [universityValue, classificationValue]);

	// --- safe action submit
	const { execute: runRegisterUser, reset: resetRegisterUser } = useAction(registerHacker, {
		onSuccess: ({ data }) => {
			if (data?.success) {
				setHasSuccess(true);

				localStorage.removeItem(HACKER_REGISTRATION_STORAGE_KEY);
				localStorage.removeItem(HACKER_REGISTRATION_RESUME_STORAGE_KEY);

				// redirect after a short beat so UI shows success
				setTimeout(() => router.push("/dash"), 250);
				return;
			}

			setIsLoading(false);
			setErrorMessage(data?.message ?? "Unexpected error occurred.");
		},
		onError: ({ error }) => {
			setIsLoading(false);
			setErrorMessage(error?.message ?? "Unexpected error occurred.");
			resetRegisterUser();
		},
	});

	async function onSubmit(data: FormData) {
		setErrorMessage(null);

		if (!isAuthLoaded) {
			setErrorMessage(
				`Auth has not loaded yet. Please try again! If this repeats, contact ${c.issueEmail}.`,
			);
			return;
		}

		setIsLoading(true);

		let resume = c.noResumeProvidedURL;
		if (uploadedFile) {
			resume = await put(staticUploads.bucketResumeBaseUploadUrl, uploadedFile, {
				presignHandlerUrl: "/api/upload/resume/register",
			});
		}

		runRegisterUser({ ...data, resume });
	}

	// -------- wizard core
	const [step, setStep] = useState(0);
	const [showStepErrors, setShowStepErrors] = useState(false);

	const sectionProps: SectionProps = {
		uploadedFile,
		setUploadedFile,
		skills,
		setSkills,
		getRootProps: dropzone.getRootProps,
		getInputProps: dropzone.getInputProps,
		isDragActive: dropzone.isDragActive,
	};

	const sections: SectionDef[] = useMemo(
		() => [
			{
				id: "personal",
				title: "General",
				fields: [
					"firstName",
					"lastName",
					"email",
					"phoneNumber",
					"age",
					"gender",
					"race",
					"ethnicity",
					"countryOfResidence",
				],
				render: (p) => <PersonalInfo {...p} />,
			},
			{
				id: "education",
				title: "University Info",
				fields: ["university", "schoolID", "levelOfStudy", "major"],
				render: (p) => <Education {...p} />,
			},
			{
				id: "experience",
				title: "Hackathon Experience",
				fields: ["hackathonsAttended", "softwareExperience", "heardFrom"],
				render: (p) => <Experience {...p} />,
			},
			{
				id: "hackday",
				title: "Day of Event",
				fields: ["shirtSize", "dietRestrictions", "accommodationNote"],
				render: (p) => <HackDay {...p} />,
			},
			{
				id: "career",
				title: "Career Info",
				fields: ["GitHub", "LinkedIn", "PersonalWebsite"],
				render: (p) => <CareerInfo {...p} />,
			},
			{
				id: "profile",
				title: "Hacker Profile",
				fields: ["hackerTag", "discord", "pronouns", "bio", "skills", "isSearchable"],
				render: (p) => <HackerProfile {...p} />,
			},
			{
				id: "resume",
				title: "Resume",
				fields: [], // resume is handled separately
				render: (p) => <Resume {...p} />,
			},
			{
				id: "mlh",
				title: "MLH",
				fields: ["hasAcceptedMLHCoC", "hasSharedDataWithMLH", "isEmailable"],
				render: (p) => <MLH />,
			},
		],
		[],
	);

	const isLast = step === sections.length - 1;

	// Clear stale errors when navigating so MLH doesn't show red immediately when you land
	useEffect(() => {
		setShowStepErrors(false);
		form.clearErrors();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [step]);

	async function next() {
		setErrorMessage(null);

		const fields = sections[step].fields;
		if (fields.length > 0) {
			const ok = await form.trigger(fields, { shouldFocus: true });
			if (!ok) {
				setShowStepErrors(true);
				return;
			}
		}

		setStep((s) => Math.min(s + 1, sections.length - 1));
	}

	function back() {
		setErrorMessage(null);
		setStep((s) => Math.max(s - 1, 0));
	}

	const current = sections[step];

	if (isLoading || hasSuccess) {
		return <CreatingRegistration hasSuccess={hasSuccess} isLoading={isLoading} hasError={!!errorMessage} />;
	}

	return (
		<FormProvider {...form}>
			<div className="relative">
				{/* Current section only (prevents huge scroll) */}
				<div
					// this makes errors not appear until you hit Next/Submit, but still allows FormMessage to render afterwards
					className={showStepErrors ? "" : "[&_[data-rhf-error]]:hidden"}
				>
					{current.render(sectionProps)}
				</div>

				{/* Nav buttons */}
				<div className="mt-6 flex items-center justify-between">
					<Button type="button" variant="outline" onClick={back} disabled={step === 0}>
						Back
					</Button>

					{isLast ? (
						<Button
							type="button"
							onClick={async () => {
								setShowStepErrors(true);
								// validate entire form on final submit
								const ok = await form.trigger(undefined, { shouldFocus: true });
								if (!ok) return;

								// submit
								form.handleSubmit(onSubmit)();
							}}
						>
							Submit
						</Button>
					) : (
						<Button type="button" onClick={next}>
							Next
						</Button>
					)}
				</div>

				{/* Global error modal/alert */}
				{!!errorMessage && (
					<div className="mt-6">
						<RegistrationFeedbackAlert
							hasError={true}
							messasge={errorMessage}
							setErrorMessage={setErrorMessage}
						/>
					</div>
				)}
			</div>
		</FormProvider>
	);
}