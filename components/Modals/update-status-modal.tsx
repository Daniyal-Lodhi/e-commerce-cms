

import { Modal } from "@/app/Modal"
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";


interface UpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (value:any) => void;
    loading: boolean; 
}

const UpdateModal: React.FC<UpdateModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    loading
}) => {

    const [ismounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, [])
    if (!ismounted) {
        return null;
    }
    return (
        <Modal  isOpen={isOpen} onClose={onClose}
            title="Are you sure?"
            description="you want to update the status of this item?"
        >
            <div className="w-full pt-6 space-x-2 flex justify-end items-center">
                <Button variant={'outline'} onClick={onClose} disabled={loading} >
                    Cancel
                </Button>
                <Button title="Enable it to show a warning modal before updating the order completion status" variant={'default'} onClick={ onConfirm } disabled={loading} >
                    Confirm
                </Button>


            </div>

        </Modal>
    )
}

export default UpdateModal
