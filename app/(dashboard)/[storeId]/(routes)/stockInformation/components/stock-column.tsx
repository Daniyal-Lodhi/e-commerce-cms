"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Edit } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
    id: string
    name: string
    quantity: number
}

const EditButton = ({ row }:{row:any}) => {
    const router = useRouter();
    const params = useParams();

    return (
        <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push(`/${params.storeId}/products/${row.original.id}`)}
        >
            <Edit size={15} />
            edit
        </div>
    )
}

export const productColumns: ColumnDef<ProductColumn>[] = [
    {
        header: "Product",
        accessorKey: "name",
    },
    {
        header: "Quantity",
        accessorKey: "quantity",
        cell: ({ row }) => Number(row.original.quantity)
    },
    {
        id: 'actions',
        cell: ({ row }) => <EditButton row={row} /> // Use the new EditButton component
    }
]
