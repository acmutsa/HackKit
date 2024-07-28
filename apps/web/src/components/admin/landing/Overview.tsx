"use client";

import {
	Bar,
	BarChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
} from "recharts";
import { parseISO, format } from "date-fns";

type DateNumberMap = { [key: string]: number };

interface OverviewProps {
	rawData: DateNumberMap;
}

export function Overview({ rawData }: OverviewProps) {
	const data = Object.entries(rawData)
		.reverse()
		.map(([date, count]) => {
			return {
				name: format(parseISO(date), "EEE"),
				total: count,
			};
		});

	return (
		<ResponsiveContainer width="100%" height={350}>
			<BarChart data={data}>
				<XAxis
					dataKey="name"
					stroke="#888888"
					fontSize={12}
					tickLine={false}
					axisLine={false}
				/>
				<YAxis
					stroke="#888888"
					fontSize={12}
					tickLine={false}
					axisLine={false}
					allowDecimals={false}
				/>
				<Bar
					dataKey="total"
					fill="currentColor"
					radius={[4, 4, 0, 0]}
					className="fill-primary"
				/>
			</BarChart>
		</ResponsiveContainer>
	);
}

export const runtime = "edge";
export const revalidate = 30;
