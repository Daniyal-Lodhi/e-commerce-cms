import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server";




// to update the store name setting
export const PATCH = async (
    req: Request,
    { params }: { params: { storeId: string } }
) => {
    try {
        const body = await req.json();
        const { userId } = auth();
        const { name } = body;


        if (!userId) {
            return new NextResponse("Authentication is required", { status: 401 });
        }
        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }
        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }


        const store = await prismadb.store.updateMany({
            where: {
                id: params.storeId,
                userId
            },
            data: {
                name
            }
        })
        return Response.json(store, { status: 200 });
    }
    catch (error) {
        console.log("[STORE_PATCH]",error) ;
        return new NextResponse("Internal Error",{status:500}) ;
    }
}

// to delete the store 
export const DELETE = async (
    req: Request,
    { params }: { params: { storeId: string } }
) => {
    try {
        const { userId } = auth();


        if (!userId) {
            return new NextResponse("Authentication is required", { status: 401 });
        }
        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }


        const store = await prismadb.store.deleteMany({
            where: {
                id: params.storeId,
                userId
            }
        })
        return Response.json(store, { status: 200 });
    }
    catch (error) {
        console.log("[STORE_DELETE]",error) ;
        return new NextResponse("Internal Error",{status:500}) ;
    }
}