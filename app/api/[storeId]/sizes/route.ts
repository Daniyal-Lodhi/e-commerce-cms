import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function POST(req:Request,
    {params}:{
        params:{storeId:string}
    }
){
    const {userId} = auth() ;
    const body = await req.json() ;
    const { name, value } = body ;
    try {
        if(!userId){
            return new NextResponse("Unauthenticated" , {status:401})
        }
        if(!params.storeId){
            return new NextResponse("Store id is required" , {status:400})
        }
        if(!name){
            return new NextResponse("name is required" , {status:400})
        }
        if(!value){
            return new NextResponse("value is required" , {status:400})
        }
        
        const storeByUserId = prismadb.store.findFirst({
            where:{
                id:params.storeId,
                userId
            }
        })

        if(!storeByUserId){
            return new NextResponse("You are not Authorized for make changes in this store",{status:403});
        }


        const size = await prismadb.size.create({
            data:{
                storeId:params.storeId,
                name,
                value
            } 
        })

        return NextResponse.json(size,{status:200}) ;
        
    } catch (error) {
        console.log('[SIZES_POST:]',error) ;
        return new NextResponse("Internal server error" , {status:500})
    }
}



export async function GET(req:Request,
    {params}:{
        params:{storeId:string}
    }
){
    try {
        
        if(!params.storeId){
            return new NextResponse("Store id is required" , {status:400})
        }
       


        const sizes = await prismadb.size.findMany({
            where:{
                storeId:params.storeId
            }
        })

        return NextResponse.json(sizes,{status:200}) ;
        
    } catch (error) {
        console.log('[SIZES_GET:]',error) ;
        return new NextResponse("Internal server error" , {status:500})
    }
}