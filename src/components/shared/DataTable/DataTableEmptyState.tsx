import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface DataTableEmptyStateProps {
	icon?: LucideIcon;
	title: string;
	description?: string;
	actionHref?: string;
	actionLabel?: string;
	actionIcon?: LucideIcon;
}

export function DataTableEmptyState({
	icon: Icon,
	title,
	description,
	actionHref,
	actionLabel,
	actionIcon: ActionIcon,
}: DataTableEmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-10 text-center">
			<Card className="max-w-md mx-auto">
				<CardContent className="flex flex-col items-center gap-4 p-6">
					{Icon && (
						<div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
							<Icon className="h-8 w-8 text-primary" />
						</div>
					)}
					<div>
						<h3 className="text-lg font-semibold">{title}</h3>
						{description && (
							<p className="text-sm text-muted-foreground mt-1">
								{description}
							</p>
						)}
					</div>
					{actionHref && actionLabel && (
						<Button asChild className="mt-2">
							<Link href={actionHref}>
								{ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
								{actionLabel}
							</Link>
						</Button>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
