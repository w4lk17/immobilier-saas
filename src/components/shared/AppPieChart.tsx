"use client";

import { Pie, PieChart } from "recharts"

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
	{ browser: "chrome", visitors: 275, fill: "var(--chart-1)" },
	{ browser: "safari", visitors: 200, fill: "var(--chart-2) " },
	{ browser: "firefox", visitors: 187, fill: "var(--chart-3)" },
	{ browser: "edge", visitors: 173, fill: "var(--chart-4)" },
	{ browser: "other", visitors: 90, fill: "var(--chart-5)" },
]

const chartConfig = {
	visitors: {
		label: "Visitors",
	},
	chrome: {
		label: "Chrome",
		color: "var(--chart-1)",
	},
	safari: {
		label: "Safari",
		color: "var(--chart-2)",
	},
	firefox: {
		label: "Firefox",
		color: "var(--chart-3)",
	},
	edge: {
		label: "Edge",
		color: "var(--chart-4)",
	},
	other: {
		label: "Other",
		color: "var(--chart-5)",
	},
} satisfies ChartConfig

export default function AppPieChart() {
	return (
		<div className="">
			<h1 className="text-lg font-medium mb-6"></h1>
			<ChartContainer
				config={chartConfig}
				className="mx-auto aspect-square max-h-[300px]"
			>
				<PieChart>
					<Pie
						data={chartData}
						dataKey="visitors"
						nameKey={"browser"}
					/>
					<ChartTooltip
						content={<ChartTooltipContent hideLabel />}
					/>
					<ChartLegend
						content={<ChartLegendContent nameKey="browser" />}
						className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
					/>
				</PieChart>
			</ChartContainer>
		</div>
	);
}