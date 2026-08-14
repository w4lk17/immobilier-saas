"use client";

import Link from "next/link";
import { PlusCircle, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { PropertyStatus, PropertyType } from "@/types/enums";
import { propertyStatusLabels, propertyTypeLabels } from "../lib/propertyLabels";

interface PropertyCardsToolbarProps {
	searchQuery: string;
	onSearchChange: (value: string) => void;
	typeFilter: PropertyType | "all";
	onTypeFilterChange: (value: PropertyType | "all") => void;
	statusFilter: PropertyStatus | "all";
	onStatusFilterChange: (value: PropertyStatus | "all") => void;
	onResetFilters: () => void;
	hasActiveFilters: boolean;
	canCreate?: boolean;
	resultCount: number;
	totalCount: number;
}

export function PropertyCardsToolbar({
	searchQuery,
	onSearchChange,
	typeFilter,
	onTypeFilterChange,
	statusFilter,
	onStatusFilterChange,
	onResetFilters,
	hasActiveFilters,
	canCreate = false,
	resultCount,
	totalCount,
}: PropertyCardsToolbarProps) {
	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
				<div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
					<div className="relative flex-1 sm:max-w-sm">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Rechercher par adresse, propriétaire…"
							value={searchQuery}
							onChange={(e) => onSearchChange(e.target.value)}
							className="pl-9"
						/>
					</div>

					<Select
						value={typeFilter}
						onValueChange={(value) => onTypeFilterChange(value as PropertyType | "all")}
					>
						<SelectTrigger className="w-full sm:w-[160px]">
							<SelectValue placeholder="Type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Tous les types</SelectItem>
							{Object.values(PropertyType).map((type) => (
								<SelectItem key={type} value={type}>
									{propertyTypeLabels[type]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{/* <Select
						value={statusFilter}
						onValueChange={(value) => onStatusFilterChange(value as PropertyStatus | "all")}
					>
						<SelectTrigger className="w-full sm:w-[160px]">
							<SelectValue placeholder="Statut" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Tous les statuts</SelectItem>
							{Object.values(PropertyStatus).map((status) => (
								<SelectItem key={status} value={status}>
									{propertyStatusLabels[status]}
								</SelectItem>
							))}
						</SelectContent>
					</Select> */}

					{hasActiveFilters && (
						<Button variant="ghost" size="sm" onClick={onResetFilters} className="shrink-0">
							<X className="mr-1 h-4 w-4" />
							Réinitialiser
						</Button>
					)}
				</div>

				{canCreate && (
					<Button asChild className="shrink-0">
						<Link href="/admin/properties/new">
							<PlusCircle className="mr-2 h-4 w-4" />
							Nouvelle propriété
						</Link>
					</Button>
				)}
			</div>

			<p className="text-sm text-muted-foreground">
				{resultCount === totalCount
					? `${totalCount} propriété${totalCount !== 1 ? "s" : ""}`
					: `${resultCount} résultat${resultCount !== 1 ? "s" : ""} sur ${totalCount}`}
			</p>
		</div>
	);
}
