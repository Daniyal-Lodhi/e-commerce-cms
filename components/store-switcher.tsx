'use client'

import React, { useEffect, useState } from "react"
import { Store } from '@prisma/client'
import { useParams, usePathname, useRouter } from "next/navigation"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { useStoreModal } from "@/hooks/use-store-modal"
import { Check, ChevronsUpDown, PlusCircle, StoreIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandInput, CommandList, CommandGroup, CommandItem } from "./ui/command"



type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger> // A way to generate type

interface StoreSwitcherProps extends PopoverTriggerProps {
    items: Store[];
}

export default function StoreSwitcher({
    className,
    items = []
}: StoreSwitcherProps) {


    const storeModal = useStoreModal();
    const pathname = usePathname();
    const params = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();


    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id
    }));

    const currentStore = formattedItems.find((item) => item.value === params.storeId);

    const onStoreChange = (store: { label: string, value: string }) => {
        setIsOpen(false);
        router.push(`/${store.value}`)
    }

    return (
        <>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger>
                    <div className={cn("text-sm border py-2 px-3 rounded-md flex w-[200px] justify-between items-center", className)}
                        title="Select a store"
                    >
                        <StoreIcon className="mr-2 w-4 h-4 " color="black" />
                        {currentStore?.label}
                        <ChevronsUpDown className="ml-auto h-4 shrink-0 opacity-50" />
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command >
                    <CommandInput placeholder="Search store..." />
                    <CommandList>
                            <CommandEmpty>No store found.</CommandEmpty>
                            <CommandGroup heading="Stores" className="">
                                {
                                    formattedItems.map((store) => (
                                        <CommandItem onSelect={()=>onStoreChange(store)} key={store.value} className="cursor-pointer text-sm" >
                                            <StoreIcon className="mr-2 h-4 w-4" />
                                            {store.label}
                                            <Check className={`ml-auto w-4 h-4   ${currentStore?.value === store.value ? 'opacity-100 ':'opacity-0'}`} />
                                            </CommandItem>
                                    ))
                                }
                            </CommandGroup>
                            {/* <CommandSeparator /> */}
                            <CommandGroup className="text-sm cursor-pointer" >
                                <CommandItem onSelect={()=>{
                                    setIsOpen(false)
                                    storeModal.onOpen();

                                }} className="flex cursor-pointer items-center text-sm" >
                                    <PlusCircle className="mr-2 h-5 w-5" />
                                    Create Store

                                </CommandItem>
                                
                            </CommandGroup>




                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    )
}