import { Badge } from "@/components/shadcn/ui/badge";
import { BadgeCheck } from "lucide-react";
import { roles } from "db/schema";
import { InferSelectModel } from "drizzle-orm";

interface RoleBadgeProps {
	role: InferSelectModel<typeof roles>;
}

function getContrastColor(hex: string) {
	// fallback
	if (!hex) return "#000";
	const cleaned = hex.replace("#", "");
	const r = parseInt(cleaned.substring(0, 2), 16);
	const g = parseInt(cleaned.substring(2, 4), 16);
	const b = parseInt(cleaned.substring(4, 6), 16);
	// luminance formula
	const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
	return luminance > 0.6 ? "#000" : "#fff";
}

export default function RoleBadge({ role }: RoleBadgeProps) {
	const bg = role.color || "#e5e7eb"; // default gray-200
	const fg = getContrastColor(bg);

	return (
		<Badge
			style={{ backgroundColor: bg, height: "32px" }}
			className={`gap-x-1 px-2`}
		>
			<span style={{ color: fg }} className="weight-700 uppercase">
				{role.name.replace(/_/g, " ")}
			</span>
			{/* show check icon if this role has any permissions (simple heuristic) */}
			{role.permissions ? (
				<BadgeCheck className="weight-700" style={{ color: fg }} />
			) : null}
		</Badge>
	);
}
