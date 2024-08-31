"use client"

import { ColumnDef } from "@tanstack/react-table"
import { BillboardCellAction } from "./billboard-actions"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BillboardColumn = {
  id: string
  label : string
  createdAt : string
  featured:boolean
}

export const billboardColumns: ColumnDef<BillboardColumn>[] = [
 
  {
    accessorKey: "label",
    header: "Label",
  },
 
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "featured",
    header: "Featured",
  },
  {
    id:'actions',
    cell: ({row})=><BillboardCellAction data={row.original} />
},
]
