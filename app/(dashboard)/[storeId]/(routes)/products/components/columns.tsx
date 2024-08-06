"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ProductCellAction } from "./billboard-actions"
import { Image } from "@prisma/client"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
  id: string
  name: string
  price: number
  category: string
  size: string
  color: string
  createdAt: string

}

export const productColumns: ColumnDef<ProductColumn>[] = [


  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "color",
    header: "Color",
  },
  {
    accessorKey: "size",
    header: "Size",
  },



  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: 'actions',
    cell: ({ row }) => <ProductCellAction data={row.original} />
  },
]
