"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ProductCellAction } from "./product-actions"
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
  isFeatured : boolean
  isArchived : boolean
  colorValue:string

}

export const productColumns: ColumnDef<ProductColumn>[] = [


  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell:({row})=> (row.original.price+ " Rps")
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => ( 
      <div className="flex flex-row w-auto items-center  ">
        {row.original.color}
        <div className='h-6 w-6 rounded-md ml-2'
          style={{ backgroundColor: row.original.colorValue }}
        />
      </div>
    )
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
