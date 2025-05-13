import { Bell } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";


export function Notification() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="relative h-8 w-8 px-0"
				>
					<Bell />
					<Badge
						className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full px-0.5 font-mono tabular-nums text-xs"
					>
						2
					</Badge>
					<span className="sr-only">Notifications</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Notifications</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>Aucune nouvelle notification</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

