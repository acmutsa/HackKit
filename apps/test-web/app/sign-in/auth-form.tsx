"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type AuthMode = "sign-in" | "sign-up";

export function AuthForm({
	mode,
}: {
	mode: AuthMode;
}) {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [isPending, setIsPending] = useState(false);
	const isSignUp = mode === "sign-up";

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		setIsPending(true);

		const form = new FormData(event.currentTarget);
		const email = String(form.get("email") ?? "");
		const password = String(form.get("password") ?? "");
		const name = String(form.get("name") ?? email);

		const result = isSignUp
			? await authClient.signUp.email({ email, password, name })
			: await authClient.signIn.email({ email, password });

		setIsPending(false);

		if (result.error) {
			setError(result.error.message ?? "Authentication failed.");
			return;
		}

		router.push(isSignUp ? "/register" : "/");
		router.refresh();
	}

	return (
		<form onSubmit={onSubmit} className="space-y-4 rounded-lg border bg-background p-6">
			{isSignUp ? (
				<label className="block space-y-2">
					<span className="text-sm font-medium">Name</span>
					<input
						name="name"
						required
						className="w-full rounded-md border bg-background px-3 py-2"
						placeholder="Demo User"
					/>
				</label>
			) : null}
			<label className="block space-y-2">
				<span className="text-sm font-medium">Email</span>
				<input
					name="email"
					type="email"
					required
					className="w-full rounded-md border bg-background px-3 py-2"
					placeholder="demo@hackkit.dev"
				/>
			</label>
			<label className="block space-y-2">
				<span className="text-sm font-medium">Password</span>
				<input
					name="password"
					type="password"
					required
					minLength={8}
					className="w-full rounded-md border bg-background px-3 py-2"
					placeholder="At least 8 characters"
				/>
			</label>
			{error ? <p className="text-sm text-destructive">{error}</p> : null}
			<button
				type="submit"
				disabled={isPending}
				className="w-full rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground disabled:opacity-60"
			>
				{isPending ? "Working..." : isSignUp ? "Create account" : "Sign in"}
			</button>
			<Link
				href={isSignUp ? "/sign-in" : "/sign-up"}
				className="block w-full text-center text-sm text-muted-foreground underline"
			>
				{isSignUp ? "Have an account? Sign in" : "Need an account? Sign up"}
			</Link>
		</form>
	);
}
