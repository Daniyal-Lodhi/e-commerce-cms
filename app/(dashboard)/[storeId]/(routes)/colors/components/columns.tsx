"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ColorCellAction } from "./size-actions"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ColorColumn = {
  id: string
  value: string
  name: String
  createdAt: string
}

export const ColorColumns: ColumnDef<ColorColumn>[] = [

  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => ( 
      <div className="flex flex-row w-auto items-center  ">
        {row.original.value}
        <div className='h-6 w-6 rounded-md ml-2'
          style={{ backgroundColor: row.original.value }}
        />
      </div>
    )
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: 'actions',
    cell: ({ row }) => <ColorCellAction data={row.original} />
  },
]
