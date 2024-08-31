'use client'
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button";
import { ChevronDown, Presentation, Ruler, Shapes, Telescope } from "lucide-react";




const MainNav = ({
    className,
    ...props
}: React.HtmlHTMLAttributes<HTMLElement>) => {
    const params = useParams();
    const pathname = usePathname();

    const routesIcon: React.ReactNode[] = [
        <Telescope/>,
        <Presentation/>,
        <Shapes/>,
        <Ruler />,
        
    ]

    const routes = [
        {
            href: `/${params.storeId}`,
            label: 'Overview',
            active: pathname == `/${params.storeId}`
        },
        {
            href: `/${params.storeId}/billboards`,
            label: 'Billboards',
            active: pathname == `/${params.storeId}/billboards`
        },
        {
            href: `/${params.storeId}/categories`,
            label: 'Categories',
            active: pathname == `/${params.storeId}/categories`
        },
        {
            href: `/${params.storeId}/sizes`,
            label: 'Sizes',
            active: pathname == `/${params.storeId}/sizes`
        },
        {
            href: `/${params.storeId}/colors`,
            label: 'Colors',
            active: pathname == `/${params.storeId}/colors`
        },

        {
            href: `/${params.storeId}/products`,
            label: 'Products',
            active: pathname == `/${params.storeId}/products`
        },
        {
            href: `/${params.storeId}/orders`,
            label: 'Orders',
            active: pathname == `/${params.storeId}/orders`
        },
        {
            href: `/${params.storeId}/settings`,
            label: 'Settings',
            active: pathname == `/${params.storeId}/settings`
        }
    ]
    return (
        <>
            <nav
                className={cn("sm:flex items-center hidden space-x-4 lg:space-x-6", className)}
            >
                {routes.map((route) => {
                    return <Link href={route.href} key={route.href} className={cn("text-sm font-medium hover:text-primary", route.active ? 'text-black dark:text-white' : 'text-muted-foreground')}>
                        {route.label}
                    </Link>
                })}

            </nav>
            <nav className="sm:hidden mr-auto " >
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="outline-none flex items-center justify-between "  >
                            Menu
                            <ChevronDown size={18} color="gray" />

                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Main menu</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            {routes.map((route,index) => (
                                <DropdownMenuItem key={route.href} >
                                    <Link  href={route.href} key={route.href} className={cn("text-sm font-medium hover:text-primary", route.active ? 'text-black dark:text-white' : 'text-muted-foreground')}>
                                        {route.label}
                                    </Link>
                                    <DropdownMenuShortcut></DropdownMenuShortcut>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuGroup>

                    </DropdownMenuContent>
                </DropdownMenu>
            </nav>
        </>
    )
}


export default MainNav;