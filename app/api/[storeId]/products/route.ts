import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function POST(req: Request,
    { params }: {
        params: { storeId: string }
    }
) {
    const { userId } = auth();
    // console.log(userId)
    const body = await req.json();
    const {
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        colorId,
        sizeId,
        images,
        quantity,
        description,
    } = body;
    try {
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }
        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 })
        }
        if (!images || !images.length) {
            return new NextResponse("Atleast one image is required", { status: 400 })
        }
        if (!price) {
            return new NextResponse("Price is required", { status: 400 })
        }
        if (!quantity) {
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
                description,
                price,
                quantity,
                isFeatured,
                isArchived,
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

    } catch (error:any) {
        console.log('[PRODUCT_POST:]', error);
        return Response.json(error.message,{status:500})
    }
}



export async function GET(req: Request,
    { params }: {
        params: { storeId: string }
    }
) {
    try {
        // destructuring search params from req.url
        const { searchParams } = new URL(req.url) ;
        const categoryId = searchParams.get('categoryId') || undefined ;
        const colorId = searchParams.get('colorId') || undefined ;
        const sizeId = searchParams.get('sizeId') || undefined ;
        const quantity = searchParams.get('quantity') || undefined ;
        const  isFeatured = Boolean(searchParams.get('isFeatured'))    ;


        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 })
        }



        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                sizeId,
                categoryId,
                quantity,
                colorId,
                isFeatured : isFeatured ? isFeatured : undefined,
                isArchived:false
            },
            include:{
                images: true,
                size:true,
                color:true,
                category:true
            }
        })

        const productsRating = await prismadb.rating.findMany({
            where:{
                productId:{
                    in: products.map((product)=>product.id)
                }
            }
        })
        const productsRatingMap = productsRating.reduce((acc, item) => {
            // Ensure that acc[item.productId] is initialized
            if (!acc[item.productId]) {
                acc[item.productId] = {
                    stars: 0,
                    count: 0
                };
            }
        
            acc[item.productId] = {
                stars: Number(acc[item.productId].stars) + Number(item.stars),
                count: acc[item.productId].count + 1
            };
        
            return acc;
        }, {} as Record<string, any>);
        

        // commented out code moved to product/productId/userId 
        // const favouriteCounts = await prismadb.favourite.groupBy({
        //     by: ['productId'],
        //     _count: {
        //         id: true, // Count the number of favourites
        //     },
        //     where: {
        //         productId: {
        //             in: products.map(product => product.id)
        //         }
        //     }
        // });

        // Create a map of productId to favourite count for easier lookup
        // const favouriteCountMap = favouriteCounts.reduce((acc, fav) => {
        //     acc[fav.productId] = fav._count.id;
        //     return acc;
        // }, {} as Record<string, number>);

        // Combine products with their respective favourite count
        const productsWithProductsRating = products.map(product => ({
            ...product,
            productRating: productsRatingMap[product.id] || {} // Default to 0 if no favourites
        }));
        // console.log(process.env.DATABASE_URL)
        return NextResponse.json(productsWithProductsRating, { status: 200 });

    } catch (error) {
        console.log('[PRODUCT_GET:]', error);
        return new NextResponse("Internal server error", { status: 500 })
    }
}
