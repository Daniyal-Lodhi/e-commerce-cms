import { corsHeaders } from "@/app/api/corsHeaders";
import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}


export async function POST(req: NextRequest, { params }: {
    params: { productId: string, userId: string }
}) {
    if (!params.productId) {
        return new NextResponse("Product id is required", { status: 400 });
    }
    if (params.userId == 'null' || !params.userId) {
        return new NextResponse("User id is required", { status: 400 });
    }
    try {
        const { liked } = await req.json();
        const likedEntry = await prismadb.favourite.findUnique({
            where: {
                userId_productId: {
                    productId: params.productId,
                    userId: params.userId
                }
            }
        })
        if (likedEntry) {
            await prismadb.favourite.update({
                where: {
                    userId_productId: {
                        productId: params.productId,
                        userId: params.userId
                    }
                }, data: {
                    liked
                }
            })
            // console.log('updated ==>', liked)
            return new NextResponse(`Product ${liked ? "liked" : "disliked"} successfully`, { status: 200, headers: corsHeaders });

        }
        else {
            await prismadb.favourite.create({
                data: {
                    userId: params.userId,
                    productId: params.productId,
                    liked
                }
            })
            // console.log('created ==> ', liked)


            return new NextResponse(`Product ${liked ? "liked" : "disliked"} successfully`, { status: 200, headers: corsHeaders });
        }




    } catch (error) {
        console.log('[ADD_TO_FAV_POST:]', error)
        return new NextResponse("Internal server error", { status: 500, headers: corsHeaders });

    }
}

// to get the big screen product

export const GET = async (req: Request,
    { params }: { params: { productId: string, userId: string } }
) => {

    try {
        if (!params.productId) {
            return new NextResponse("Product id is required", { status: 400 })
        }

        const isLiked = await prismadb.favourite.findUnique({
            where: {
                userId_productId: {
                    userId: params.userId,
                    productId: params.productId,
                },
                liked: true
            }
        })
        var product = await prismadb.product.findUnique({
            where: {
                id: params.productId
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true,
            }
        })
        var likedProduct;
        const productRating = await prismadb.rating.findMany({
            where: {
                productId: params.productId
            }
        })

        let productRatingObj = productRating.reduce((acc, product) => {
            if (product.comment) {
                acc['stars'] = acc['stars'] + Number(product.stars)
                acc['count'] = acc['count'] + 1
                acc['comments'] = [...acc['comments'], {
                    'comment': product?.comment,
                    'commentedBy': product.username,
                    'stars': product.stars,
                }]
            }
            return acc
        }, {
            stars: 0,
            comments: [],
            count: 0,
        } as Record<string, any>)
        if (isLiked) {
            // with rating
            likedProduct = { ...product, liked: true, productRating: productRatingObj }
            return NextResponse.json(likedProduct, { status: 200 });

        }


        let productWithRatings = {
            ...product,
            productRating: productRatingObj
        }


        return NextResponse.json(productWithRatings, { status: 200 });
    } catch (error) {
        console.log("[PRODUCT_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

