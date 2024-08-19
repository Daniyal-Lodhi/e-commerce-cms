// create get, edit and delete ctg

import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export const GET = async (req: Request,
    { params }: { params: { categoryId: string } }
) => {

    try {
        if (!params.categoryId) {
            return new NextResponse("Category id is required", { status: 400 })
        }

        const category = await prismadb.categories.findUnique({
            where: {
                id: params.categoryId
            },
            include:{
                billboard:true
            }
        })

        return NextResponse.json(category, { status: 200 });
    } catch (error) {
        console.log("[CATEGORY_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}


export const PATCH = async (
    req: Request,
    { params }: { params: { categoryId: string, storeId: string } }
) => {
    try {
        const body = await req.json();
        const { userId } = auth();
        const { name, billboardId } = body;


        if (!userId) {
            return new NextResponse("Authentication is required", { status: 401 });
        }
        if (!name) {
            return new NextResponse("Category name is required", { status: 400 });
        }
        if (!billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 });
        }
        
        if (!params.categoryId) {
            return new NextResponse("Category id id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("You are not Authorized for make changes in this store", { status: 403 });
        }


        const category = await prismadb.categories.updateMany({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                billboardId
            }
        })
        return new Response("Category updated", { status: 200 });
    }
    catch (error) {
        console.log("[CATEGORY_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


export const DELETE = async (
    req: Request,
    { params }: { params: { categoryId: string, storeId: string } }
) => {
    try {
        const { userId } = auth();


        if (!userId) {
            return new NextResponse("Authentication is required", { status: 401 });
        }
        if (!params.categoryId) {
            return new NextResponse("Category id is required", { status: 400 });
        }
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("You are not Authorized for make changes in this store", { status: 403 });
        }


        const category = await prismadb.categories.delete({
            where: {
                id: params.categoryId,
            }
        })
        return Response.json(category, { status: 200 });
    }
    catch (error) {
        console.log("[CATEGORY_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}