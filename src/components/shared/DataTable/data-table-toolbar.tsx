"use client"

import { Table } from "@tanstack/react-table"
import { X, Download } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableViewOptions } from "./data-table-view-options"
import { exportToCSV, exportToExcel } from "@/lib/exportUtils"

// import { priorities, statuses } from "../data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	data: TData[];
	searchColumn: string;
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
	searchPlaceholder,
	newButtonHref,
	newButtonTitle,
	enableExport = false,
	exportFileName = 'export'
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0
	const [isExporting, setIsExporting] = useState(false)

	const handleExportCSV = () => {
		setIsExporting(true)
		try {
			exportToCSV(data, exportFileName)
		} finally {
			setIsExporting(false)
		}
	}

	const handleExportExcel = () => {
		setIsExporting(true)
		try {
			exportToExcel(data, exportFileName)
		} finally {
			setIsExporting(false)
		}
	}

	return (
		<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
			{/* Search and filters - Full width on mobile */}
			<div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
				<Input
					id="search"
					placeholder={searchPlaceholder}
					value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn(searchColumn)?.setFilterValue(event.target.value)
					}
					className="h-9 w-full sm:w-auto sm:min-w-[200px] lg:min-w-[250px] max-w-md"
				/>
				{/* Faceted filters would go here */}
				{isFiltered && (
					<Button
						variant="ghost"
						onClick={() => table.resetColumnFilters()}
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
					<DataTableViewOptions table={table} />
					{enableExport && (
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
								<DropdownMenuItem onClick={handleExportExcel}>
									Exporter en Excel
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
				{newButtonHref && newButtonTitle && (
					<Button
						size="sm"
						asChild
						className="flex-1 sm:flex-none"
					>
						<Link href={newButtonHref}>{newButtonTitle}</Link>
					</Button>
				)}
			</div>
		</div>
	)
}
