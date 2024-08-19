"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ProductCellAction } from "./product-actions"
import { Image } from "@prisma/client"
import Currency from "@/components/currency"

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
  quantity:number

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
    cell:({row})=><Currency  value={row.original.price} />
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
    header: "Quantity",
    accessorKey: "quantity",
    cell:({row})=>Number(row.original.quantity)
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
