'use client'

import { BillboardColumn } from "./columns"

import { useState } from 'react'


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import toast from "react-hot-toast"
import { } from "next/router"
import { useRouter, useParams } from "next/navigation"
import axios from "axios"
import AlertModal from "@/components/Modals/alert-modal"


interface BillboardCellActionProps {
    data: BillboardColumn
}


export const BillboardCellAction: React.FC<BillboardCellActionProps> = ({ data }) => {

    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id)
        toast.success('Billboard id copied to the clipboard.')
    }

    const onDelete = async () => {
        setLoading(true);
        try {
            await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);
            router.refresh();
            // router.push(`/${params.storeId}/billboards`);
            toast.success("Billboard deleted successfully")
        } catch (error) {
            console.log(error);
            toast.error('Make sure you delete all the products and categories using this billboard')
        } finally {
            setTimeout(() => {
                document.body.style.pointerEvents = 'auto';
            }, 300)
            setLoading(false);
            setOpen(false);
        }


    }


    return (
        <>
            <AlertModal
                loading={loading}
                isOpen={open}
                onClose={() => {
                    setTimeout(() => {
                        document.body.style.pointerEvents = 'auto';
                    }, 300)
                    setOpen(false);
                }}
                onConfirm={onDelete}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="p-0 h-8 w-8 " variant={'ghost'}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/billboards/${data.id}`)} >
                        <Edit className="h-4 w-4 mr-2" />
                        edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className="h-4 w-4 mr-2" />
                        copy id
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className="h-4 w-4 mr-2" />
                        delete
                    </DropdownMenuItem>
                </DropdownMenuContent>

            </DropdownMenu>
        </>

    )
}