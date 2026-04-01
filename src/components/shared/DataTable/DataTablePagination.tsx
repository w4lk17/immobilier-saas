import { Table } from "@tanstack/react-table"
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

interface DataTablePaginationProps<TData> {
	table: Table<TData>
}

export function DataTablePagination<TData>({
	table,
}: DataTablePaginationProps<TData>) {
	const currentPage = table.getState().pagination.pageIndex + 1;
	const totalPages = table.getPageCount()
	const canPrevious = table.getCanPreviousPage()
	const canNext = table.getCanNextPage()

	return (
		<div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4">
			{/* Selected rows count */}
			<div className="text-sm text-muted-foreground text-center sm:text-left">
				{table.getFilteredSelectedRowModel().rows.length} sur{" "}
				{table.getFilteredRowModel().rows.length} ligne(s)
			</div>

			{/* Mobile: Compact pagination */}
			<div className="flex items-center justify-center gap-2 w-full sm:hidden">
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!canPrevious}
					className="px-3"
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>
				<span className="text-sm font-medium min-w-[80px] text-center">
					{currentPage} / {totalPages}
				</span>
				<Button
					variant="outline"
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!canNext}
					className="px-3"
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>

			{/* Desktop: Full pagination controls */}
			<div className="hidden sm:flex items-center justify-between gap-6 flex-1 w-full">
				{/* Page size selector */}
				<div className="flex items-center gap-2">
					<p className="text-sm font-medium whitespace-nowrap">
						Lignes par page
					</p>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value) => {
							table.setPageSize(Number(value))
						}}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{[10, 20, 30, 40, 50].map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Page info */}
				<div className="flex items-center justify-center text-sm font-medium whitespace-nowrap">
					Page {currentPage} sur {totalPages}
				</div>

				{/* Navigation buttons */}
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0"
						onClick={() => table.setPageIndex(0)}
						disabled={!canPrevious}
					>
						<span className="sr-only">Aller à la première page</span>
						<ChevronsLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() => table.previousPage()}
						disabled={!canPrevious}
					>
						<span className="sr-only">Page précédente</span>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() => table.nextPage()}
						disabled={!canNext}
					>
						<span className="sr-only">Page suivante</span>
						<ChevronRight className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0"
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!canNext}
					>
						<span className="sr-only">Aller à la dernière page</span>
						<ChevronsRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	)
}
