"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Image } from "@prisma/client"
import Currency from "@/components/currency"
import { Edit, MoveRight } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
    id: string
    name: string
    quantity: number
}



export const productColumns: ColumnDef<ProductColumn>[] = [


    {
        accessorKey: "name",
        header: "Name",
    },

    {
        header: "Quantity",
        accessorKey: "quantity",
        cell: ({ row }) => Number(row.original.quantity)
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const router = useRouter();
            const params = useParams();
            return (
                <div className="flex items-center gap-2 cursor-pointer"
                    onClick={() => router.push(`/${params.storeId}/products/${row.original.id}`)}
                >
                    <Edit size={15} />
                    edit
                </div>
            )
        }
    }

]
