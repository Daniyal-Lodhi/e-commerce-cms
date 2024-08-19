"use client"

import { ColumnDef } from "@tanstack/react-table"
import { OrderCellAction } from "./order-actions"
import Currency from "@/components/currency"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderColumn = {
  id: string
  products : string
  totalPrice : number
  phoneNumber: string
  address: string
  createdAt : string
  paid :boolean
}

export const orderColumns: ColumnDef<OrderColumn>[] = [
 
  {
    accessorKey: "products",
    header: "Products",
  },
 

  {
    accessorKey: "phoneNumber",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Adress",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
    cell:({row})=><Currency  value={row.original.totalPrice} />
  },
  {
    accessorKey: "paid",
    header: "Paid",
  },
]
