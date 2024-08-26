"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
} from "@tanstack/react-table"


import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "./button"
import { Input } from "./input"
import { usePathname } from "next/navigation"
import { SelectDataItem } from "./select-item"
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    searchKey?: string
    data: TData[]
    searchKey2?: string
    searchKey3?: string
}

export function DataTable<TData, TValue>({
    columns,
    searchKey,
    data,

}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
        },

    })

    const [searchKeySelect, setSearchKeySelect] = useState('products');


    const pathname = usePathname();
    const currentPath: string = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length)

    return (
        <>
            <div className="flex items-center py-4 gap-4">
                <Input
                    placeholder={`Filter ${currentPath == 'orders' ? searchKeySelect : searchKey}...`}
                    value={(table.getColumn(currentPath == 'orders' ? searchKeySelect : searchKey!)?.getFilterValue() as string) ?? ""}
                    onChange={(event) => {
                        return (table.getColumn(currentPath == 'orders' ? searchKeySelect : searchKey!)?.setFilterValue(event.target.value))
                    }
                    }
                    className="max-w-sm"
                />
                {currentPath === 'orders' &&
                    <div>
                        <SelectDataItem
                            data={['Product', 'Phone', 'Paid', 'Completed']}
                            setData={setSearchKeySelect}
                            defSearchKey={"Product"}
                            title=" Select filter"
                        />
                    </div>

                }
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
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
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </>
    )
}
