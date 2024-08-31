// create get, edit and delete bb

import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export const GET = async (req: Request,
    { params }: { params: { billboardId: string } }
) => {

    try {
        if (!params.billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 })
        }

        const billboard = await prismadb.billboards.findUnique({
            where: {
                id: params.billboardId
            }
        })

        return NextResponse.json(billboard, { status: 200 });
    } catch (error) {
        console.log("[BILLBOARD_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}


export const PATCH = async (
    req: Request,
    { params }: { params: { billboardId: string, storeId: string } }
) => {
    try {
        const body = await req.json();
        const { userId } = auth();
        const { label, imageUrl,featured } = body;


        if (!userId) {
            return new NextResponse("Authentication is required", { status: 401 });
        }
        if (!label) {
            return new NextResponse("label is required", { status: 400 });
        }
        if (!imageUrl) {
            return new NextResponse("Image Url is required", { status: 400 });
        }
        if (!params.billboardId) {
            return new NextResponse("billlboard id is required", { status: 400 });
        }
        if(featured == null || featured==undefined){
            return new NextResponse("featured value is required", { status: 400 });

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


        const billboard = await prismadb.billboards.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl,
                featured
            }
        })
        return new Response("Billboard updated", { status: 200 });
    }
    catch (error) {
        console.log("[BILLBOARD_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


export const DELETE = async (
    req: Request,
    { params }: { params: { billboardId: string, storeId: string } }
) => {
    try {
        const { userId } = auth();


        if (!userId) {
            return new NextResponse("Authentication is required", { status: 401 });
        }
        if (!params.billboardId) {
            return new NextResponse("billlboard id is required", { status: 400 });
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


        const billboard = await prismadb.billboards.delete({
            where: {
                id: params.billboardId,
            }
        })
        return Response.json(billboard, { status: 200 });
    }
    catch (error) {
        console.log("[BILLBOARD_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}