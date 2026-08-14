import type { ReactNode } from "react";

type PageHeaderProps = {
	title: string;
	description?: ReactNode;
	/** Optional right column (buttons, links, etc.) */
	actions?: ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
	return (
		<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">{title}</h1>
				{description != null && (
					<p className="text-muted-foreground">{description}</p>
				)}
			</div>
			{actions != null && (
				<div className="flex items-center gap-2">{actions}</div>
			)}
		</div>
	);
}
