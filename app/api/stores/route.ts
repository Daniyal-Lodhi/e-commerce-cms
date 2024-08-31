import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
export async function POST(req:Request){
    const {userId} = auth() ;
    const body = await req.json() ;
    const { name,frontendUrl } = body ;
    try {
        if(!userId){
            return new NextResponse("Unauthorized" , {status:401})
        }
        if(!name){
            return new NextResponse("Name is required" , {status:400})
        }
        var store;
        if(frontendUrl){
            store = await prismadb.store.create({
                data:{
                    name,
                    userId,
                    frontendUrl
                } 
            })
        }
        else{
            store = await prismadb.store.create({
                data:{
                    name,
                    userId
                } 
            })
        }

        return NextResponse.json(store) ;
        
    } catch (error) {
        console.log('[STORE_POST:]',error) ;
        return new NextResponse("Internal server error" , {status:500})
    }

}