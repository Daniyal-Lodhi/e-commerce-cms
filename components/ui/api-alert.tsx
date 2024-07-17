'use client'

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Copy, icons, Server } from "lucide-react";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "./button";
import toast from "react-hot-toast";


interface ApiAlertProps {
    title: string;
    description: string;
    variant: 'public' | 'admin'

}


const textMap: Record<ApiAlertProps['variant'], string> = {
    public: 'Public',
    admin: 'Admin',
};

const variantMap: Record<ApiAlertProps['variant'], BadgeProps['variant']> = {
    admin: 'destructive',
    public: "secondary",
}

export const ApiAlert: React.FC<ApiAlertProps> = ({
    title,
    description,
    variant
}) => {

    const onCopy = () => {
        navigator.clipboard.writeText(description) ;
        toast.success("API Route copied to the clipboard.")
    }



    return (
        <Alert>
            <Server className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-x-2 text-sm font-bold" >
                {title}
                <Badge variant={variantMap[variant]} >
                    {textMap[variant]}
                </Badge>
            </AlertTitle>
            <AlertDescription className="mt-4 justify-between items-center flex">
                <code className="text-sm font-semibold rounded bg-muted px-[0.3rem] py-[0.2rem]" >
                    {description}
                </code>
                <Button
                    variant={'outline'}
                    size={'icon'}
                    onClick={onCopy}
                >
                <Copy className="h-4 w-4" />

                </Button>
            </AlertDescription>
        </Alert>
    )
}