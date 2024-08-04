"use client"

import { ColumnDef } from "@tanstack/react-table"
import { SizeCellAction } from "./size-actions"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type SizeColumn = {
  id: string
  value : string
  name : String
  createdAt : string
}

export const SizeColumns: ColumnDef<SizeColumn>[] = [
 
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id:'actions',
    cell: ({row})=><SizeCellAction data={row.original} />
},
]
