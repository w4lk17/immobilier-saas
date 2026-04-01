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

	// Search
	searchColumn?: string;
	searchColumns?: string[];
	searchPlaceholder?: string;

	// New button
	newButtonHref?: string;
	newButtonTitle?: string;

	// Bulk actions
	enableBulkActions?: boolean;
	bulkActions?: (selectedRows: TData[]) => React.ReactNode;

	// Export (future feature)
	enableExport?: boolean;
	exportFileName?: string;

	// Mobile
	enableMobileCards?: boolean;

	// Empty state
	emptyStateContent?: React.ReactNode;

	// Table meta
	meta?: TableMeta<TData>;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	searchColumn,
	searchColumns,
	searchPlaceholder = "Rechercher",
	newButtonHref,
	newButtonTitle,
	enableBulkActions = false,
	bulkActions,
	enableExport = false,
	exportFileName = 'export',
	enableMobileCards = false,
	emptyStateContent,
	meta,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

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
		enableRowSelection: enableBulkActions,
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

	// Get selected rows for bulk actions
	const selectedRows = React.useMemo(() => {
		return table.getFilteredSelectedRowModel().rows.map((row) => row.original);
	}, [table]);

	return (
		<div className="flex flex-col gap-4">
			<DataTableToolbar
				table={table}
				data={data}
				searchColumn={searchColumn || ''}
				searchPlaceholder={searchPlaceholder}
				newButtonHref={newButtonHref || ''}
				newButtonTitle={newButtonTitle || ''}
				enableExport={enableExport}
				exportFileName={exportFileName}
			/>

			{/* Bulk Actions Bar */}
			{enableBulkActions && bulkActions && table.getFilteredSelectedRowModel().rows.length > 0 && (
				<div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md border">
					<span className="text-sm text-muted-foreground">
						{table.getFilteredSelectedRowModel().rows.length} sélectionné(s)
					</span>
					<div className="flex-1" />
					{bulkActions(selectedRows)}
				</div>
			)}

			{/* Desktop: Table view with horizontal scroll */}
			<div className="overflow-x-auto rounded-md border">
				<div className="min-w-[640px]">
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
											<TableCell key={cell.id}>
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
			</div>

			{/* Controls de Pagination */}
			<DataTablePagination table={table} />
		</div>
	);
}
