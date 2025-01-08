"use client";
import { Avatar, AvatarImage } from "../shadcn/ui/avatar";
import { encodeFileAsBase64 } from "@/lib/utils/shared/files";
import { updateProfileImage } from "@/actions/user-profile-mod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { Input } from "../shadcn/ui/input";
import { Button } from "../shadcn/ui/button";
import { Loader2 } from "lucide-react";

export default function ProfilePhotoSettings({
	profilePhoto,
}: {
	profilePhoto: string;
}) {
	const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	// this input will either be null or a reference to the input element
	const profileInputRef = useRef<HTMLInputElement | null>(null);

	const { execute: runUpdateProfileImage } = useAction(updateProfileImage, {
		onSuccess: (res) => {
			setIsLoading(false);
			setNewProfileImage(null);
			toast.dismiss();
			if (profileInputRef.current) {
				profileInputRef.current.value = "";
			}
			console.log(`res data message: ${res.data?.message}`);
			if (!res.data?.success) {
				toast.error(
					"An error occurred while updating your profile photo!",
				);
				return;
			}
			if (res.data?.message === "file_too_large") {
				toast.error("Please upload a file smaller than 10MB");
				return;
			}
			toast.success("Profile Photo updated successfully!");
		},
		onError: () => {
			setIsLoading(false);
			toast.dismiss();
			if (profileInputRef.current) {
				profileInputRef.current.value = "";
			}
			toast.error("An error occurred while updating your profile photo!");
		},
	});

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		let file = event.target.files?.[0] || null;
		if ((file?.size || -1) > 10000000) {
			file = null;
			profileInputRef.current!.value = "";
			toast.error("Please upload a file smaller than 10MB");
		}
		setNewProfileImage(file);
	};
	return (
		<div className="rounded-lg border-2 border-muted px-5 py-10">
			<h2 className="pb-5 text-3xl font-semibold">Profile Photo</h2>
			<div className="max-w-[500px] space-y-4">
				<div>
					<Avatar className={"h-24 w-24"}>
						<AvatarImage
							src={profilePhoto}
							alt={"User Profile Photo"}
						></AvatarImage>
					</Avatar>
					<Input
						ref={profileInputRef}
						accept=".jpg, .jpeg, .png, .gif, .mp4"
						type="file"
						name="photo"
						className="mb-4 mt-2 cursor-pointer file:cursor-pointer file:text-primary dark:border-primary dark:bg-transparent dark:ring-offset-primary"
						onChange={handleFileChange}
					/>
					<p className="text-xs text-muted-foreground">
						Note: Only pictures less 10MB will be accepted.
					</p>
				</div>
				<Button
					onClick={async () => {
						if (!newProfileImage) {
							return toast.error(
								"Please select a profile photo to upload!",
							);
						}
						setIsLoading(true);
						const fileBase64 =
							await encodeFileAsBase64(newProfileImage);
						runUpdateProfileImage({
							fileBase64,
							fileName: newProfileImage.name,
						});
					}}
					className="mt-5"
					disabled={isLoading}
				>
					{isLoading ? (
						<>
							<Loader2 className={"mr-2 h-4 w-4 animate-spin"} />
							<div>Updating</div>
						</>
					) : (
						"Update"
					)}
				</Button>
			</div>
		</div>
	);
}
