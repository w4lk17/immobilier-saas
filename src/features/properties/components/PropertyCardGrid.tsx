"use client";

import { useMemo, useState } from "react";
import { Building2, ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import Link from "next/link";

import { PropertyWithRelations } from "@/types";
import { PropertyStatus, PropertyType } from "@/types/enums";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Permission, hasPermission } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { PropertyCardsToolbar } from "./PropertyCardsToolbar";
import { PropertyCard } from "./PropertyCard";
import { PropertyActions } from "./property-actions";
import { PropertyDetailsModal } from "./PropertyDetailsModal";

const PAGE_SIZE_OPTIONS = [6, 9, 12, 18];

interface PropertyCardGridProps {
	properties: PropertyWithRelations[];
}

function matchesSearch(property: PropertyWithRelations, query: string): boolean {
	const q = query.toLowerCase().trim();
	if (!q) return true;

	const ownerName = `${property.owner?.user?.firstName ?? ""} ${property.owner?.user?.lastName ?? ""}`.toLowerCase();
	const managerName = `${property.manager?.user?.firstName ?? ""} ${property.manager?.user?.lastName ?? ""}`.toLowerCase();

	return (
		property.address.toLowerCase().includes(q) ||
		(property.description?.toLowerCase().includes(q) ?? false) ||
		ownerName.includes(q) ||
		managerName.includes(q)
	);
}

export function PropertyCardGrid({ properties }: PropertyCardGridProps) {
	const { user } = useAuth();

	const [searchQuery, setSearchQuery] = useState("");
	const [typeFilter, setTypeFilter] = useState<PropertyType | "all">("all");
	const [statusFilter, setStatusFilter] = useState<PropertyStatus | "all">("all");
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(9);
	const [selectedProperty, setSelectedProperty] = useState<PropertyWithRelations | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const canCreate = user && hasPermission(user.role, Permission.PROPERTIES_CREATE);

	const filteredProperties = useMemo(() => {
		return properties.filter((property) => {
			if (typeFilter !== "all" && property.type !== typeFilter) return false;
			if (statusFilter !== "all" && property.status !== statusFilter) return false;
			return matchesSearch(property, searchQuery);
		});
	}, [properties, searchQuery, typeFilter, statusFilter]);

	const totalPages = Math.max(1, Math.ceil(filteredProperties.length / pageSize));
	const safePageIndex = Math.min(pageIndex, totalPages - 1);
	const paginatedProperties = filteredProperties.slice(
		safePageIndex * pageSize,
		safePageIndex * pageSize + pageSize
	);

	const hasActiveFilters =
		searchQuery.trim() !== "" || typeFilter !== "all" || statusFilter !== "all";

	const handleResetFilters = () => {
		setSearchQuery("");
		setTypeFilter("all");
		setStatusFilter("all");
		setPageIndex(0);
	};

	const handleSearchChange = (value: string) => {
		setSearchQuery(value);
		setPageIndex(0);
	};

	const handleTypeFilterChange = (value: PropertyType | "all") => {
		setTypeFilter(value);
		setPageIndex(0);
	};

	const handleStatusFilterChange = (value: PropertyStatus | "all") => {
		setStatusFilter(value);
		setPageIndex(0);
	};

	const handleViewDetails = (property: PropertyWithRelations) => {
		setSelectedProperty(property);
		setIsModalOpen(true);
	};

	if (properties.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center">
				<Card className="max-w-md">
					<CardContent className="flex flex-col items-center gap-4 p-8">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
							<Building2 className="h-8 w-8 text-primary" />
						</div>
						<div>
							<h3 className="text-lg font-semibold">Aucune propriété</h3>
							<p className="mt-1 text-sm text-muted-foreground">
								Commencez par ajouter votre première propriété.
							</p>
						</div>
						{canCreate && (
							<Button asChild>
								<Link href="/admin/properties/new">
									<PlusCircle className="mr-2 h-4 w-4" />
									Ajouter une propriété
								</Link>
							</Button>
						)}
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<PropertyCardsToolbar
				searchQuery={searchQuery}
				onSearchChange={handleSearchChange}
				typeFilter={typeFilter}
				onTypeFilterChange={handleTypeFilterChange}
				statusFilter={statusFilter}
				onStatusFilterChange={handleStatusFilterChange}
				onResetFilters={handleResetFilters}
				hasActiveFilters={hasActiveFilters}
				canCreate={!!canCreate}
				resultCount={filteredProperties.length}
				totalCount={properties.length}
			/>

			{filteredProperties.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-12 text-center">
					<p className="text-muted-foreground">Aucun résultat pour ces critères.</p>
					{hasActiveFilters && (
						<Button variant="link" onClick={handleResetFilters} className="mt-2">
							Réinitialiser les filtres
						</Button>
					)}
				</div>
			) : (
				<>
					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
						{paginatedProperties.map((property) => (
							<PropertyCard
								key={property.id}
								property={property}
								onViewDetails={() => handleViewDetails(property)}
								actions={<PropertyActions property={property} />}
							/>
						))}
					</div>

					{filteredProperties.length > PAGE_SIZE_OPTIONS[0] && (
						<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<span>Par page</span>
								<Select
									value={`${pageSize}`}
									onValueChange={(value) => {
										setPageSize(Number(value));
										setPageIndex(0);
									}}
								>
									<SelectTrigger className="h-8 w-[70px]">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{PAGE_SIZE_OPTIONS.map((size) => (
											<SelectItem key={size} value={`${size}`}>
												{size}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
									disabled={safePageIndex === 0}
								>
									<ChevronLeft className="h-4 w-4" />
								</Button>
								<span className="min-w-[100px] text-center text-sm">
									Page {safePageIndex + 1} sur {totalPages}
								</span>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setPageIndex((p) => Math.min(totalPages - 1, p + 1))}
									disabled={safePageIndex >= totalPages - 1}
								>
									<ChevronRight className="h-4 w-4" />
								</Button>
							</div>
						</div>
					)}
				</>
			)}

			<PropertyDetailsModal
				property={selectedProperty}
				isOpen={isModalOpen}
				onOpenChange={setIsModalOpen}
			/>
		</div>
	);
}
