"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

// import { priorities, statuses } from "../data/data"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	searchColumn: string;
	searchPlaceholder: string;
	newButtonHref: string;
	newButtonTitle: string;
}

export function DataTableToolbar<TData>({
	table,
	searchColumn,
	searchPlaceholder,
	newButtonHref,
	newButtonTitle
}: DataTableToolbarProps<TData>) {
	const isFiltered = table.getState().columnFilters.length > 0

	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center gap-2">
				<Input
					id="search"
					placeholder={searchPlaceholder}
					value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn(searchColumn)?.setFilterValue(event.target.value)
					}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
				{/* {table.getColumn("status") && (
					<DataTableFacetedFilter
						column={table.getColumn("status")}
						title="Status"
						options={statuses}
					/>
				)}
				{table.getColumn("priority") && (
					<DataTableFacetedFilter
						column={table.getColumn("priority")}
						title="Priority"
						options={priorities}
					/>
				)} */}
				{isFiltered && (
					<Button
						variant="ghost"
						onClick={() => table.resetColumnFilters()}
						className="h-8 px-2 lg:px-3"
					>
						Reset
						<X />
					</Button>
				)}
			</div>
			<div className="flex items-center gap-2">
				<DataTableViewOptions table={table} />
				<Button
					size="sm"
					asChild
				>
					<Link href={newButtonHref}>{newButtonTitle}</Link>
				</Button>
			</div>
		</div>
	)
}