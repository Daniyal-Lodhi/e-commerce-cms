import { Modal } from "@/app/Modal"
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";


interface alertModalProps{
    isOpen: boolean;
    onClose:()=>void;
    onConfirm:()=>void;
    loading:boolean;
}

const AlertModal: React.FC<alertModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    loading
}) => {

    const [ismounted,setIsMounted] = useState(false) ;
    useEffect(()=>{
        setIsMounted(true) ;
    },[])

    if(!ismounted){
        return null ;
    }
  return (
    <Modal isOpen={isOpen} onClose={onClose}
    title="Are you sure?"
    description="this action cannot be undone"
    >
        <div className="w-full pt-6 space-x-2 flex justify-end items-center">
            <Button variant={'outline'} onClick={onClose} disabled={loading} >
                Cancel
            </Button>
            <Button variant={'destructive'} onClick={onConfirm} disabled={loading} >
                Confirm
            </Button>


        </div>

    </Modal>
  )
}

export default AlertModal
