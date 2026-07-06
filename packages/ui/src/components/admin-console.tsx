import Link from "next/link";
import type { AdminOverview, AdminUserRecord, Role } from "@hackkit/core";
import { BadgeText, formatDateTime, fullName } from "../lib/admin-console";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { AdminUserActions, AdminRoleManager } from "./admin-console-controls";

export type AdminOverviewPanelProps = {
	overview: AdminOverview;
};

export function AdminOverviewPanel({ overview }: AdminOverviewPanelProps) {
	const stats = [
		["Registrations", overview.totalUsers],
		["Hackers", overview.totalHackers],
		["Approved", overview.approvedUsers],
		["Pending Approval", overview.pendingApprovalUsers],
		["Suspended", overview.bannedUsers],
		["Check-ins", overview.checkedInUsers],
		["RSVPs", overview.confirmedRsvps],
		["Waitlist", overview.waitlistedRsvps],
	] as const;

	return (
		<div className="space-y-6">
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{stats.map(([label, value]) => (
					<Card key={label}>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm font-medium">{label}</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold">{value}</div>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="grid gap-4 lg:grid-cols-[1fr_24rem]">
				<Card>
					<CardHeader>
						<CardTitle>Recent Signups</CardTitle>
						<CardDescription>New accounts over the last seven days.</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{overview.recentSignups.map((item) => (
								<div key={item.date} className="grid grid-cols-[7rem_1fr_auto] items-center gap-3 text-sm">
									<span className="font-mono text-muted-foreground">{item.date}</span>
									<div className="h-2 overflow-hidden rounded-full bg-muted">
										<div
											className="h-full rounded-full bg-primary"
											style={{
												width: `${Math.min(100, item.count * 12)}%`,
											}}
										/>
									</div>
									<span className="font-medium">{item.count}</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Recent Users</CardTitle>
						<CardDescription>Newest account records.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						{overview.recentUsers.map((record) => (
							<Link
								key={record.user.authId}
								href={`/admin/users/${encodeURIComponent(record.user.authId)}`}
								className="block rounded-md border p-3 hover:bg-muted"
							>
								<div className="font-medium">{fullName(record)}</div>
								<div className="text-sm text-muted-foreground">
									{record.user.email}
								</div>
							</Link>
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export type AdminUsersTableProps = {
	users: AdminUserRecord[];
	exportHref?: string;
};

export function AdminUsersTable({ users, exportHref }: AdminUsersTableProps) {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between gap-4">
				<p className="text-sm text-muted-foreground">
					Total users: {users.length}
				</p>
				{exportHref ? (
					<Button asChild variant="outline">
						<a href={exportHref}>Export CSV</a>
					</Button>
				) : null}
			</div>
			<div className="overflow-hidden rounded-lg border">
				<table className="w-full text-sm">
					<thead className="bg-muted text-left">
						<tr>
							<th className="px-4 py-3 font-medium">User</th>
							<th className="px-4 py-3 font-medium">Role</th>
							<th className="px-4 py-3 font-medium">Status</th>
							<th className="px-4 py-3 font-medium">RSVP</th>
							<th className="px-4 py-3 font-medium">Registered</th>
							<th className="px-4 py-3 font-medium">Check-in</th>
						</tr>
					</thead>
					<tbody>
						{users.map((record) => (
							<tr key={record.user.authId} className="border-t">
								<td className="px-4 py-3">
									<Link
										href={`/admin/users/${encodeURIComponent(record.user.authId)}`}
										className="font-medium hover:underline"
									>
										{fullName(record)}
									</Link>
									<div className="text-muted-foreground">{record.user.email}</div>
									{record.user.hackTag ? (
										<div className="font-mono text-xs text-muted-foreground">
											@{record.user.hackTag}
										</div>
									) : null}
								</td>
								<td className="px-4 py-3">{record.role?.name ?? "No role"}</td>
								<td className="px-4 py-3">
									<div className="flex flex-wrap gap-2">
										<BadgeText tone={record.user.isApproved ? "success" : "muted"}>
											{record.user.isApproved ? "Approved" : "Pending"}
										</BadgeText>
										{record.ban ? <BadgeText tone="danger">Suspended</BadgeText> : null}
										{record.hacker ? <BadgeText tone="info">Hacker</BadgeText> : null}
									</div>
								</td>
								<td className="px-4 py-3">{formatRsvpStatus(record.rsvp)}</td>
								<td className="px-4 py-3">{formatDateTime(record.user.createdAt)}</td>
								<td className="px-4 py-3">
									{record.user.checkedInAt ? formatDateTime(record.user.checkedInAt) : "Not checked in"}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export type AdminUserDetailProps = {
	record: AdminUserRecord;
	roles: Role[];
};

export function AdminUserDetail({ record, roles }: AdminUserDetailProps) {
	return (
		<div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
			<div className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>{fullName(record)}</CardTitle>
						<CardDescription>{record.user.email}</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 sm:grid-cols-2">
						<Detail label="Auth ID" value={record.user.authId} />
						<Detail label="HackTag" value={record.user.hackTag ? `@${record.user.hackTag}` : "Not claimed"} />
						<Detail label="Role" value={record.role?.name ?? "No role"} />
						<Detail label="Joined" value={formatDateTime(record.user.createdAt)} />
						<Detail label="Approval" value={record.user.isApproved ? "Approved" : "Pending"} />
						<Detail label="RSVP" value={formatRsvpStatus(record.rsvp)} />
						<Detail label="Check-in" value={record.user.checkedInAt ? formatDateTime(record.user.checkedInAt) : "Not checked in"} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Hacker Registration</CardTitle>
						<CardDescription>Competition registration fields.</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 sm:grid-cols-2">
						<Detail label="University" value={record.hacker?.university ?? "Not registered"} />
						<Detail label="Major" value={record.hacker?.major ?? ""} />
						<Detail label="Level of Study" value={record.hacker?.levelOfStudy ?? ""} />
						<Detail label="Hackathons Attended" value={record.hacker ? String(record.hacker.hackathonsAttended) : ""} />
						<Detail label="Experience" value={record.hacker?.softwareExperience ?? ""} />
						<Detail label="Group" value={record.hacker?.group ?? ""} />
						<Detail label="Resume" value={record.hacker?.resumeUrl ?? ""} />
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>User Data</CardTitle>
						<CardDescription>Participant account and event data.</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 sm:grid-cols-2">
						<Detail label="Age" value={record.userData ? String(record.userData.age) : "Not completed"} />
						<Detail label="Shirt Size" value={record.userData?.shirtSize ?? ""} />
						<Detail label="Dietary Restrictions" value={record.userData?.dietaryRestrictions.join(", ") ?? ""} />
						<Detail label="Phone" value={record.userData?.phoneNumber ?? ""} />
						<Detail label="Country" value={record.userData?.countryOfResidence ?? ""} />
						<Detail label="Emailable" value={record.userData ? String(record.userData.isEmailable) : ""} />
					</CardContent>
				</Card>
			</div>

			<AdminUserActions record={record} roles={roles} />
		</div>
	);
}

export type AdminRolesPanelProps = {
	roles: Role[];
	permissions: string[];
};

export function AdminRolesPanel(props: AdminRolesPanelProps) {
	return <AdminRoleManager {...props} />;
}

function Detail({ label, value }: { label: string; value?: string }) {
	return (
		<div className="space-y-1">
			<div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
				{label}
			</div>
			<div className="break-words text-sm">{value || "None"}</div>
		</div>
	);
}

function formatRsvpStatus(record: AdminUserRecord["rsvp"]): string {
	if (!record) return "No RSVP";
	if (record.status === "waitlisted" && record.waitlistPosition) {
		return `Waitlisted #${record.waitlistPosition}`;
	}
	return record.status[0].toUpperCase() + record.status.slice(1);
}
