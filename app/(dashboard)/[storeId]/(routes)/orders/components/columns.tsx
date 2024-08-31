"use client"

import { ColumnDef } from "@tanstack/react-table"
import Currency from "@/components/currency"
import UpdateOrderStatus from "./update-order-status"
import UpdatePaidStatus from "./update-paid-status"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderColumn = {
  id: string
  products: string
  totalPrice: number
  phoneNumber: string
  address: string | null
  createdAt: string
  paid: boolean
  completed: boolean
  paymentType:string
  completedAt:Date | null
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
    cell: ({ row }) => <Currency value={row.original.totalPrice} />
  },
  {
    header: "Payment Type",
    accessorKey: "paymentType",
  },
  {
    header: "Paid",
    cell: ({ row }) => <div className="flex items-center gap-2" >
      <UpdatePaidStatus isCompleted={row.original.completed} orderId={row.original.id} isPaid={row.original.paid} paymentType={row.original.paymentType} />

    </div>
  },

  {
    header: "Completed",
    cell: ({ row }) => <div className="flex items-center gap-2" >
      <UpdateOrderStatus  
      orderId={row.original.id} 
      isPaid={row.original.paid} 
      isCompleted={row.original.completed} 
      completedAt={row.original.completedAt}
      />

    </div>

  }
]
