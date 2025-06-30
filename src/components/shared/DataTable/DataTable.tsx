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
	ColumnFiltersState,
	getFilteredRowModel,
	TableMeta,
	VisibilityState,
	getFacetedRowModel,
	getFacetedUniqueValues,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from './DataTablePagination';
import { DataTableToolbar } from './data-table-toolbar';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	searchColumn: string;
	searchPlaceholder?: string;
	newButtonHref: string;
	newButtonTitle: string;
	// Optionnel: props pour une recherche globale simple
	// globalFilter?: string;
	// setGlobalFilter?: (filter: string) => void;
	emptyStateContent?: React.ReactNode;
	meta?: TableMeta<TData>;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	searchColumn,
	searchPlaceholder = "Rechercher",
	newButtonHref,
	newButtonTitle,
	emptyStateContent,
	meta,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]); // Pour les filtres par colonne 
	const [rowSelection, setRowSelection] = React.useState({})
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

	const table = useReactTable({
		data,
		columns,
		meta: meta || {},
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});

	return (
		<div className="flex flex-col gap-4">
			<DataTableToolbar
				table={table}
				searchColumn={searchColumn}
				searchPlaceholder={searchPlaceholder}
				newButtonHref={newButtonHref}
				newButtonTitle={newButtonTitle}
			/>
			<div className="rounded-md border">
				<Table>
					<TableHeader className='bg-muted'>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} colSpan={header.colSpan}>
											{header.isPlaceholder
												? null
												: flexRender(
													header.column.columnDef.header,
													header.getContext()
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
										<TableCell key={cell.id} > {/* Ajuster le style si besoin */}
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
