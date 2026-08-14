"use client"

import { Table } from "@tanstack/react-table"
import { X, Download, Filter } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableViewOptions } from "./data-table-view-options"
import { exportToCSV, exportToExcel } from "@/lib/exportUtils"

// import { priorities, statuses } from "../data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { hasPermission, Permission } from "@/lib"

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	data: TData[];
	searchColumn?: string;         // Pour rétrocompat
	searchColumns?: string[];      // Nouveauté: tableau de colonnes pour recherche multiple
	searchPlaceholder: string;
	newButtonHref: string;
	newButtonTitle: string;
	enableExport?: boolean;
	exportFileName?: string;
}

export function DataTableToolbar<TData>({
	table,
	data,
	searchColumn,
	searchColumns,
	searchPlaceholder,
	newButtonHref,
	newButtonTitle,
	enableExport = false,
	exportFileName = 'export'
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0
	const [isExporting, setIsExporting] = useState(false)
	const { user } = useAuth();

	const canCreate = user && hasPermission(user.role, Permission.TENANTS_CREATE);

	// Recherche multi-colonnes : priorité à searchColumns (si défini et non vide)
	const columnsToSearch = searchColumns && searchColumns.length > 0
		? searchColumns
		: searchColumn
			? [searchColumn]
			: [];

	// On récupère la valeur commune (si toutes les colonnes ont la même valeur de filtre) ou '' si différentes
	const searchValue = (() => {
		if (columnsToSearch.length === 0) return "";
		const values = columnsToSearch.map(col => (table.getColumn(col)?.getFilterValue() as string) ?? "");
		return values.every((v) => v === values[0]) ? values[0] : "";
	})();

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		columnsToSearch.forEach(col => table.getColumn(col)?.setFilterValue(event.target.value));
	};

	const handleExportCSV = () => {
		setIsExporting(true)
		try {
			// exportToCSV(data, exportFileName)
		} finally {
			setIsExporting(false)
		}
	}

	const handleExportPDF = () => {
		setIsExporting(true)
		try {
			// exportToExcel(data, exportFileName)
		} finally {
			setIsExporting(false)
		}
	}

	const handleResetFilters = () => {
		table.resetColumnFilters();
	};

	return (
		<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
			{/* Search and filters - Full width on mobile */}
			<div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
				<Input
					id="search"
					placeholder={searchPlaceholder}
					value={searchValue}
					onChange={handleSearchChange}
					className="h-9 w-full sm:w-auto sm:min-w-[200px] lg:min-w-[250px] max-w-md"
				/>
				{/* Faceted filters would go here */}
				{isFiltered && (
					<Button
						variant="ghost"
						onClick={handleResetFilters}
						className="h-9 px-2 lg:px-3"
					>
						Reset
						<X className="h-4 w-4" />
					</Button>
				)}
			</div>

			{/* View options, export and new button - Stack on mobile, row on desktop */}
			<div className="flex items-center gap-2 w-full sm:w-auto justify-between">
				<div className="flex items-center gap-2">
					{/* pour affiche l'option de selection de colonne */}
					{/* <DataTableViewOptions table={table} /> */}

					{canCreate && newButtonHref && newButtonTitle && (
						<Button
							size="sm"
							asChild
							className="flex-1 sm:flex-none"
						>
							<Link href={newButtonHref}>{newButtonTitle}</Link>
						</Button>
					)}

					{enableExport && user?.role !== 'TENANT' && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm" disabled={isExporting || data.length === 0}>
									<Download className="h-4 w-4 sm:mr-2" />
									<span className="hidden sm:inline">
										{isExporting ? 'Export...' : 'Export'}
									</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={handleExportCSV}>
									Exporter en CSV
								</DropdownMenuItem>
								{/* <DropdownMenuItem onClick={handleExportPDF}>
									Exporter en PDF
								</DropdownMenuItem> */}
							</DropdownMenuContent>
						</DropdownMenu>
					)}

					{/* Ajouter un bouton de dropdown pour filtrer par statut */}
					{/* {statusFilterOptions && statusFilterOptions.length > 0 && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm" className="flex items-center gap-2">
									<Filter className="h-4 w-4 sm:mr-2" />
									<span className="hidden sm:inline">Filtrer Statut</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem
									onClick={() => {
										table.getColumn(statusFilterKey)?.setFilterValue(undefined)
									}}
								>
									<span className="font-medium">Tous les statuts</span>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								{statusFilterOptions.map((option) => (
									<DropdownMenuItem
										key={option.value}
										onClick={() => {
											table.getColumn(statusFilterKey)?.setFilterValue(option.value)
										}}
									>
										{option.icon && <span className="mr-2">{option.icon}</span>}
										{option.label}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					)} */}
				</div>
			</div>
		</div>
	)
}
