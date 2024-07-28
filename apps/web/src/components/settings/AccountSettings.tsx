"use client";

import { Input } from "@/components/shadcn/ui/input";
import { Button } from "@/components/shadcn/ui/button";
import { Label } from "@/components/shadcn/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { users } from "db/schema";
import { z } from "zod";
import { useAction } from "next-safe-action/hook";
import { modifyAccountSettings } from "@/actions/user-profile-mod";

interface UserProps {
  firstName: string;
  lastName: string;
}
interface AccountSettingsProps {
  user: UserProps;
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const [newFirstName, setNewFirstName] = useState(user.firstName);
  const [newLastName, setNewLastName] = useState(user.lastName);

  const { execute: runModifyAccountSettings } = useAction(
    modifyAccountSettings,
    {
      onSuccess: () => {
        toast.dismiss();
        toast.success("Name updated successfully!");
      },
      onError: () => {
        toast.dismiss();
        toast.error("An error occurred while updating your name!");
      },
    }
  );

  return (
    <main>
      <div className="border-2 border-muted rounded-lg py-10 px-5">
        <h2 className="font-semibold text-3xl pb-5">Personal Information</h2>
        <div className="max-w-[500px] space-y-4">
          <div>
            <Label htmlFor="firstname">First Name</Label>
            <Input
              className="mt-2"
              name="firstname"
              value={newFirstName}
              onChange={(e) => setNewFirstName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="lastname">Last Name</Label>
            <Input
              className="mt-2"
              name="lastname"
              value={newLastName}
              onChange={(e) => setNewLastName(e.target.value)}
            />
          </div>
          <Button
            className="mt-5"
            onClick={() => {
              toast.loading("Updating name...");
              runModifyAccountSettings({
                firstName: newFirstName,
                lastName: newLastName,
              });
            }}
          >
            Update
          </Button>
        </div>
      </div>
    </main>
  );
}
