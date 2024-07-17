"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CategoryCellAction } from "./category-actions"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CategoryColumn = {
  id: string
  name : string
  createdAt : string
  billboardLabel : string
}

export const categoryColumns: ColumnDef<CategoryColumn>[] = [
 
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "billboardLabel",
    header: "Bilboard",
    cell : ({row})=>row.original.billboardLabel,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
 
  {
      id:'actions',
      cell: ({row})=><CategoryCellAction data={row.original} />
  },
]
