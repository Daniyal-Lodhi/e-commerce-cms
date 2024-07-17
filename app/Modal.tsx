'use client'

import { Dialog,
     DialogHeader,
     DialogContent,
     DialogDescription,
     DialogTitle,
     DialogTrigger
} from "@/components/ui/dialog";

interface ModalProps {
    title: string,
    description: string,
    isOpen: boolean,
    onClose: () => void,
    children?: React.ReactNode
}
export const Modal: React.FC<ModalProps> = ({
    title,
    description,
    isOpen,
    onClose,
    children
}) => {
    const onChange = (open: boolean) => {
        if (!open) {
            // what happens when modal is closed    
            onClose(); 
            console.log("closed")
        }
    };
    return (
        <Dialog  open={isOpen} onOpenChange={()=>onClose()} >  
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                       {description}
                    </DialogDescription>
                </DialogHeader>
                <div>{children}</div>
            </DialogContent>
        </Dialog>

    )
}