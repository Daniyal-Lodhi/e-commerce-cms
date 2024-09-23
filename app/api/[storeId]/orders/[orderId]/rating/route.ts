import { corsHeaders } from "@/app/api/corsHeaders";
import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(req: NextRequest, { params }: {
    params: { storeId: string, orderId: string }
}
) {
    if (!params.orderId) {
        return new NextResponse("Order Id is required", { status: 400, headers: corsHeaders })
    }


    try {
        const { productId, comment, stars, userId, username } = await req.json();
        let Comment = comment;
        if (!userId) {
            return new NextResponse("User id is required", { status: 400, headers: corsHeaders })
        }
        if (!username) {
            return new NextResponse("User name is required", { status: 400, headers: corsHeaders })
        }
        if (!productId) {
            return new NextResponse("Product id is required", { status: 400, headers: corsHeaders })
        }
        if (!stars) {
            return new NextResponse("Stars are required", { status: 400, headers: corsHeaders })
        }
        if (typeof Comment === 'string' && Comment.trim().length === 0) {
            Comment = undefined;
        } const isRated = await prismadb.rating.findUnique({
            where: {
                orderId_productId: {
                    orderId: params.orderId,
                    productId
                }
            }
        });

        if (isRated) {
            return new NextResponse("You have already rated this product for this order", { status: 400, headers: corsHeaders })
        }

        await prismadb.rating.create({
            data: {
                orderId: params.orderId,
                productId: productId,
                stars,
                comment: Comment,
                userId: userId,
                username,
            }
        })

        await prismadb.orderItems.update({
            where: {
                orderId_productId: {
                    orderId: params.orderId,
                    productId
                }
            },
            data: {
                isRated: true
            }
        })

        return new NextResponse('Item rated successfully', { status: 200, headers: corsHeaders })



    } catch (error) {
        console.log("[ORDER_RATING_POST:]", error);
        return new NextResponse("Some Error occured", { status: 500, headers: corsHeaders });
    }
}