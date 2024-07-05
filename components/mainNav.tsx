'use client'
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";




const MainNav = ({
    className,
    ...props
}:React.HtmlHTMLAttributes<HTMLElement>)=>{
    const params = useParams() ;
    const pathname = usePathname() ;

    const routes  = [
        {
            href:`/${params.storeId}`,
            label : 'Overview',
            active: pathname == `/${params.storeId}`
        },
        {
            href:`/${params.storeId}/settings`,
            label : 'Settings',
            active: pathname == `/${params.storeId}/settings`
        }
    ]
    return(
        <nav
        className={cn("flex items-center space-x-4 lg:space-x-6",className)}
        >
            {routes.map((route)=>{
                return <Link href={route.href} key={route.href} className={cn("text-sm font-medium hover:text-primary",route.active?'text-black dark:text-white':'text-muted-foreground')}>
                    {route.label}
                </Link> 
            })}

        </nav>
    )
}


export default MainNav ;