import type { LucideIcon } from "lucide-react";
import {
	SquareTerminal,
	Users,
	CalendarDays,
	ShieldCheck,
	ToggleLeft,
	ScanLine,
	Book,
	MessageCircleQuestion,
} from "lucide-react";
import { PermissionType } from "@/lib/constants/permission";

export type AdminNavItem = {
	title: string;
	url: string;
	icon: LucideIcon;
	isActive?: boolean;
	permission?: PermissionType | PermissionType[];
	items?: {
		title: string;
		url: string;
		permission?: PermissionType | PermissionType[];
	}[];
};

export type AdminSidebarData = {
	navMain: AdminNavItem[];
	navSecondary: {
		title: string;
		url: string;
		icon: LucideIcon;
		permission?: PermissionType | PermissionType[];
	}[];
};

export type BreadcrumbLabels = Record<string, string>;

export const adminSidebarData: AdminSidebarData = {
	navMain: [
		{
			title: "Overview",
			url: "/admin",
			icon: SquareTerminal,
			isActive: true,
			permission: PermissionType.ADMIN,
		},
		{
			title: "Users",
			url: "/admin/users",
			icon: Users,
			permission: PermissionType.VIEW_USERS,
		},
		{
			title: "Events",
			url: "/admin/events",
			icon: CalendarDays,
			permission: PermissionType.VIEW_EVENTS,
		},
		{
			title: "Roles",
			url: "/admin/roles",
			icon: ShieldCheck,
			permission: PermissionType.VIEW_ROLES,
		},
		{
			title: "Toggles",
			url: "/admin/toggles",
			icon: ToggleLeft,
			permission: PermissionType.MANAGE_NAVLINKS,
		},
		{
			title: "Hackathon Check-in",
			url: "/admin/check-in",
			icon: ScanLine,
			permission: [PermissionType.CHECK_IN, PermissionType.CREATE_SCANS],
		},
	],
	navSecondary: [
		{
			title: "Documentation",
			url: "https://acmutsa.dev/hackkit",
			icon: Book,
		},
		{
			title: "Join our Discord",
			url: "https://discord.gg/PmVFgcJ6du",
			icon: MessageCircleQuestion,
		},
	],
};

export const BreadcrumbLabels: BreadcrumbLabels = {
	admin: "Admin",
	"check-in": "Check In",
	events: "Events",
	edit: "Edit",
	new: "New",
	roles: "Roles",
	scanner: "Scanner",
	toggles: "Toggles",
	dashboard: "Dashboard",
	landing: "Landing",
	registration: "Registration",
	users: "Users",
};
