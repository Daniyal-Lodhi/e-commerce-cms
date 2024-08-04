// create get, edit and delete bb

import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export const GET = async (req: Request,
    { params }: { params: { colorId: string } }
) => {

    try {
        if (!params.colorId) {
            return new NextResponse("Color id is required", { status: 400 })
        }

        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId
            }
        })

        return NextResponse.json(color, { status: 200 });
    } catch (error) {
        console.log("[COLORS_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}


export const PATCH = async (
    req: Request,
    { params }: { params: { colorId: string, storeId: string } }
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
        if (!params.colorId) {
            return new NextResponse("color id is required", { status: 400 });
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


        const color = await prismadb.color.updateMany({
            where: {
                id: params.colorId,
            },
            data: {
                name,
                value
            }
        })
        return new Response("Color updated", { status: 200 });
    }
    catch (error) {
        console.log("[COLOR_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


export const DELETE = async (
    req: Request,
    { params }: { params: { colorId: string, storeId: string } }
) => {
    try {
        const { userId } = auth();


        if (!userId) {
            return new NextResponse("Authentication is required", { status: 401 });
        }
        if (!params.colorId) {
            return new NextResponse("color id is required", { status: 400 });
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


        const color = await prismadb.color.delete({
            where: {
                id: params.colorId,
            }
        })
        return Response.json(color, { status: 200 });
    }
    catch (error) {
        console.log("[COLOR_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}