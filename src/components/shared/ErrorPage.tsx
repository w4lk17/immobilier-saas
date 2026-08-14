import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface ErrorPageProps {
	icon: LucideIcon;
	title: string;
	description: string;
	actions?: {
		label: string;
		href: string;
		variant?: "default" | "outline";
		icon?: LucideIcon;
	}[];
}

export function ErrorPage({ icon: Icon, title, description, actions }: ErrorPageProps) {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
			<Card className="max-w-md w-full">
				<CardHeader className="text-center">
					<div className="flex justify-center mb-4">
						<div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
							<Icon className="h-8 w-8 text-red-600" />
						</div>
					</div>
					<CardTitle className="text-2xl">{title}</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2">
					{actions?.map((action) => (
						<Button
							key={action.href}
							asChild
							variant={action.variant || "default"}
							className="w-full"
						>
							<Link href={action.href}>
								{action.icon && <action.icon className="mr-2 h-4 w-4" />}
								{action.label}
							</Link>
						</Button>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
