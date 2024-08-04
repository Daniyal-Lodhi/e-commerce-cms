// create get, edit and delete bb

import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export const GET = async (req: Request,
    { params }: { params: { sizeId: string } }
) => {

    try {
        if (!params.sizeId) {
            return new NextResponse("Size id is required", { status: 400 })
        }

        const size = await prismadb.size.findUnique({
            where: {
                id: params.sizeId
            }
        })

        return NextResponse.json(size, { status: 200 });
    } catch (error) {
        console.log("[SIZE_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}


export const PATCH = async (
    req: Request,
    { params }: { params: { sizeId: string, storeId: string } }
) => {
    try {
        const body = await req.json();
        const { userId } = auth();
        const { name , value } = body;


        if (!userId) {
            return new NextResponse("Authentication is required", { status: 401 });
        }
        if (!name) {
            return new NextResponse("name is required", { status: 400 });
        }
        if (!value) {
            return new NextResponse(" value is required", { status: 400 });
        }
        if (!params.sizeId) {
            return new NextResponse("size id is required", { status: 400 });
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


        const size = await prismadb.size.updateMany({
            where: {
                id: params.sizeId,
            },
            data: {
                name,
                value
            }
        })
        return new Response("Size updated", { status: 200 });
    }
    catch (error) {
        console.log("[SIZE_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


export const DELETE = async (
    req: Request,
    { params }: { params: { sizeId: string, storeId: string } }
) => {
    try {
        const { userId } = auth();


        if (!userId) {
            return new NextResponse("Authentication is required", { status: 401 });
        }
        if (!params.sizeId) {
            return new NextResponse("size id is required", { status: 400 });
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


        const size = await prismadb.size.delete({
            where: {
                id: params.sizeId,
            }
        })
        return Response.json(size, { status: 200 });
    }
    catch (error) {
        console.log("[SIZE_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}