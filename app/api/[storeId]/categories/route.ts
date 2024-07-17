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
    const { name, billboardId } = body ;
    try {
        if(!userId){
            return new NextResponse("Unauthenticated" , {status:401})
        }
        if(!params.storeId){
            return new NextResponse("Store id is required" , {status:400})
        }
        if(!name){
            return new NextResponse("Category name is required" , {status:400})
        }
        if(!billboardId){
            return new NextResponse("Billboard id is required" , {status:400})
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


        const categories = await prismadb.categories.create({
            data:{
                storeId:params.storeId,
                billboardId,
                name
            } 
        })

        return NextResponse.json(categories,{status:200}) ;
        
    } catch (error) {
        console.log('[CATEGORIES_POST:]',error) ;
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

        const categories = await prismadb.categories.findMany({
            where:{
                storeId:params.storeId
            }
        })

        return NextResponse.json(categories,{status:200}) ;
        
    } catch (error) {
        console.log('[CATEGORIES_GET:]',error) ;
        return new NextResponse("Internal server error" , {status:500})
    }
}