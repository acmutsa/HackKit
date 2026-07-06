"use client";

import { UserProfileSettingsForm } from "@hackkit/ui";
import type { User } from "@hackkit/core";
import { uploadProfilePhotoFile } from "@/lib/upload-profile-photo";

export function ProfileSettingsClient({ currentUser }: { currentUser: User }) {
	return (
		<UserProfileSettingsForm
			currentUser={currentUser}
			uploadProfilePhoto={uploadProfilePhotoFile}
		/>
	);
}
