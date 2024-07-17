import { Navbar } from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ClientPageRoot } from "next/dist/client/components/client-page";
import { redirect } from "next/navigation";
import React from "react";



export default async function DashboardLayout({ children,params }: {
    children: React.ReactNode
    params:{storeId:string}
}) {

    const { userId } = auth();
    if(!userId){
        redirect('/sign-in')
    }
    console.log(userId)

    const store = await prismadb.store.findFirst({
        where:{
            userId,
            id:params.storeId
        }
    })
    

    if(!store){
        redirect('/');
    }
    return(
        <>
        <Navbar />
        
        {children}
        </>
    )
}