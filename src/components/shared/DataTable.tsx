// src/components/shared/DataTable.tsx
"use client";

import React, { useState } from 'react';
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	ColumnFiltersState, // Pour les filtres futurs
	getFilteredRowModel, // Pour les filtres futurs
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DataTablePagination } from './DataTablePagination';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	// Optionnel: props pour une recherche globale simple
	globalFilter?: string;
	setGlobalFilter?: (filter: string) => void;
	// Optionnel: Contenu à afficher si la table est vide (au lieu du message par défaut)
	emptyStateContent?: React.ReactNode;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	globalFilter,
	setGlobalFilter,
	emptyStateContent,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	// const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]); // Pour les filtres par colonne futurs

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		// onColumnFiltersChange: setColumnFilters, // Pour les filtres par colonne futurs
		// getFilteredRowModel: getFilteredRowModel(), // Pour les filtres futurs
		// Si vous gérez le globalFilter en interne:
		// onGlobalFilterChange: setGlobalFilter,
		state: {
			sorting,
			// columnFilters, // Pour les filtres par colonne futurs
			// globalFilter, // Si vous utilisez la recherche globale gérée en externe
		},
	});

	return (
		<div className=" space-y-4">
			{/* Optionnel: Barre d'outils avec recherche globale (si setGlobalFilter est fourni) */}
			{/* {setGlobalFilter && (
        <div className="flex items-center py-4">
          <Input
            placeholder="Rechercher dans toutes les colonnes..."
            value={(table.getState().globalFilter as string) ?? globalFilter ?? ""}
            onChange={(event) => {
                // Si géré en interne: table.setGlobalFilter(event.target.value)
                // Si géré en externe:
                if(setGlobalFilter) setGlobalFilter(event.target.value)
            }}
            className="max-w-sm"
          />
        </div>
      )} */}

			<div className="rounded-md border">
				<Table>
					<TableHeader className='bg-muted'>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} className="whitespace-nowrap">
											{header.isPlaceholder
												? null
												: (
													<div
														className={cn(
															"flex items-center gap-2",
															header.column.getCanSort() ? "cursor-pointer select-none" : ""
														)}
														onClick={header.column.getToggleSortingHandler()}
														title={
															header.column.getCanSort()
																? header.column.getNextSortingOrder() === 'asc'
																	? 'Trier par ordre croissant'
																	: header.column.getNextSortingOrder() === 'desc'
																		? 'Trier par ordre décroissant'
																		: 'Effacer le tri'
																: undefined
														}
													>
														{flexRender(
															header.column.columnDef.header,
															header.getContext()
														)}
														{{
															asc: <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />, // Ou une icône spécifique pour asc
															desc: <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />, // Ou une icône spécifique pour desc
														}[header.column.getIsSorted() as string] ?? (header.column.getCanSort() ? <ArrowUpDown className="ml-2 h-4 w-4 opacity-30 hover:opacity-100" /> : null)}
													</div>
												)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="whitespace-nowrap"> {/* Ajuster le style si besoin */}
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									{emptyStateContent || "Aucun résultat."}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>

			</div>
			{/* Contrôles de Pagination */}
			<DataTablePagination table={table} />

		</div>
	);
}
