import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
 interface KPICardProps {
	title: string;
	value: string;
	description?: string;
	icon: React.ElementType;
	// Optionnel: pour barres de progression ou pourcentages
	progressValue?: number;
	progressTotal?: number;
	trend?: 'up' | 'down' | 'neutral'; // Juste pour idée, pas implémenté visuellement ici
}

export function KPICard({ title, value, description, icon: Icon, progressValue }: KPICardProps) {
	return (
		<Card className="py-2">
			<CardHeader className="flex flex-row items-center justify-between space-y-0">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<Icon className="h-5 w-5 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				{description && <p className="text-xs text-muted-foreground">{description}</p>}
				{progressValue !== undefined && (
					<Progress value={progressValue} className="mt-2 h-2" aria-label={`${progressValue}%`} />
				)}
			</CardContent>
			<CardFooter>
				<div className="text-xs text-muted-foreground">Facture Août</div>
			</CardFooter>
		</Card>
	);
}