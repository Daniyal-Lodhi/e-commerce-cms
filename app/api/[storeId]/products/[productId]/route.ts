// create get, edit and delete bb

import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"


// moved to ==>  products/produtid/userid

// export const GET = async (req: Request,
//     { params }: { params: { productId: string } }
// ) => {

//     try {
//         if (!params.productId) {
//             return new NextResponse("Product id is required", { status: 400 })
//         }

//         const product = await prismadb.product.findUnique({
//             where: {
//                 id: params.productId
//             },
//             include: {
//                 images: true,
//                 category: true,
//                 size: true,
//                 color: true,
//             }
//         })


//         return NextResponse.json(product, { status: 200 });
//     } catch (error) {
//         console.log("[PRODUCT_GET]", error);
//         return new NextResponse("Internal error", { status: 500 });
//     }
// }


export const PATCH = async (
    req: Request,
    { params }: { params: { productId: string, storeId: string } }
) => {
    try {
        const body = await req.json();
        const { userId } = auth();
        const {
            name,
            description,
            price,
            quantity,
            isFeatured,
            isArchived,
            categoryId,
            colorId,
            sizeId,
            images,
        } = body;

        if (!userId) {
            return new NextResponse("Authentication is required", { status: 401 });
        }
        if (!params.productId) {
            return new NextResponse("product id is required", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 })
        }
        if (!images || !images.length) {
            return new NextResponse("Atleast one image is required", { status: 400 })
        }
        if (!name) {
            return new NextResponse("Name is required", { status: 400 })
        }
        
        if (quantity===undefined || quantity == null) {
            return new NextResponse("Quantity is required", { status: 400 })
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
        // if (!billboardId) {
        //     return new NextResponse("Billboard id is required", { status: 400 })
        // }



        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse("You are not Authorized for make changes in this store", { status: 403 });
        }


        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                description,
                price,
                isFeatured,
                isArchived,
                quantity,
                categoryId,
                colorId,
                sizeId,
                images: {
                    deleteMany: {} // it deletes the previous images linked with the product
                }
            },
        })

        const product = await prismadb.product.update({
            where: {
                id: params.productId
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                }
            }
        })

        return new Response("Product updated", { status: 200 });
    }
    catch (error) {
        console.log("[PRODUCT_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


export const DELETE = async (
    req: Request,
    { params }: { params: { productId: string, storeId: string } }
) => {
    try {
        const { userId } = auth();


        if (!userId) {
            return new NextResponse("Authentication is required", { status: 401 });
        }
        if (!params.productId) {
            return new NextResponse("product id is required", { status: 400 });
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


        const product = await prismadb.product.delete({
            where: {
                id: params.productId,
            }
        })
        return Response.json(product, { status: 200 });
    }
    catch (error) {
        console.log("[PRODUCT_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}