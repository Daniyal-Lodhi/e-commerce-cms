import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { useSearchParams } from "next/navigation";
import { NextResponse } from "next/server";
import { string } from "zod";


export async function POST(req: Request,
    { params }: {
        params: { storeId: string }
    }
) {
    const { userId } = auth();
    const body = await req.json();
    const {
        name,
        price,
        isFeatured,
        isArchived,
        billboardId,
        categoryId,
        colorId,
        sizeId,
        images,
    } = body;
    try {
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }
        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 })
        }
        if (!images || !images.length) {
            return new NextResponse("Images is required", { status: 400 })
        }
        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }
        if (!price) {
            return new NextResponse("Price is required", { status: 400 })
        }
        if (!colorId) {
            return new NextResponse("Color id is required", { status: 400 })
        }
        if (!sizeId) {
            return new NextResponse("Size id is required", { status: 400 })
        }
        if (!categoryId) {
            return new NextResponse("Category id is required", { status: 400 })
        }
        if (!billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 })
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


        const product = await prismadb.product.create({
            data: {
                storeId: params.storeId,
                name,
                price,
                isFeatured,
                isArchived,
                billboardId,
                categoryId,
                colorId,
                sizeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                }
            }
        });

        return NextResponse.json(product, { status: 200 });

    } catch (error) {
        console.log('[PRODUCT_POST:]', error);
        return new NextResponse("Internal server error", { status: 500 })
    }
}



export async function GET(req: Request,
    { params }: {
        params: { storeId: string }
    }
) {
    try {
        const { searchParams } = new URL(req.url) ;
        const categoryId = searchParams.get('categoryId') || undefined ;
        const colorId = searchParams.get('colorId') || undefined ;
        const sizeId = searchParams.get('sizeId') || undefined ;
        const isFeatured = searchParams.get('isFeatured')  ;


        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 })
        }



        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                sizeId,
                categoryId,
                colorId,
                isFeatured : isFeatured ? isFeatured : undefined 
            },
            include:{
                images: true,
                size:true,
                color:true,
                category:true
            }
        })

        return NextResponse.json(products, { status: 200 });

    } catch (error) {
        console.log('[PRODUCT_GET:]', error);
        return new NextResponse("Internal server error", { status: 500 })
    }
}
