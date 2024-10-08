'use client'
import { StoreModal } from "@/components/Modals/store-modal";
import { useEffect, useState } from "react"

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);
    // use effect will only work when this component runs in client side 
    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) {
        return null;
    }
    return (
        <>
            <StoreModal />
        </>
    )
}