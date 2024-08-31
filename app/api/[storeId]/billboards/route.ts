import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function POST(req: Request,
    { params }: {
        params: { storeId: string }
    }
) {
    const { userId } = auth();
    const body = await req.json();
    const { imageUrl, label } = body;
    try {
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }
        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 })
        }
        if (!imageUrl) {
            return new NextResponse("image url is required", { status: 400 })
        }
        if (!label) {
            return new NextResponse("label is required", { status: 400 })
        }

        const storeByUserId = prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("You are not Authorized for make changes in this store", { status: 403 });
        }


        const billboard = await prismadb.billboards.create({
            data: {
                storeId: params.storeId,
                label,
                imageUrl
            }
        })

        return NextResponse.json(billboard, { status: 200 });

    } catch (error) {
        console.log('[BILLBOARDS_POST:]', error);
        return new NextResponse("Internal server error", { status: 500 })
    }
}



export async function GET(req: Request,
    { params }: {
        params: { storeId: string }
    }
) {
    const { searchParams } = new URL(req.url)
    let isFeatured = searchParams.get("featured") || undefined
    
    try {
        
        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 })
        }
        var billboards;
        if (isFeatured !== undefined) {
            let featured:boolean = isFeatured==='true'?true:false;
            console.log(featured)
            billboards = await prismadb.billboards.findMany({
                where: {
                    storeId: params.storeId,
                    featured
                }
            })
        }

        else {
            billboards = await prismadb.billboards.findMany({
                where: {
                    storeId: params.storeId,
                }
            })
        }

        return NextResponse.json(billboards, { status: 200 });

    } catch (error) {
        console.log('[BILLBOARDS_GET:]', error);
        return new NextResponse("Internal server error", { status: 500 })
    }
}