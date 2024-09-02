import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { corsHeaders } from "../../corsHeaders";


//  This route is for cash on delivery order creation
export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}


export async function POST(request: Request,
    { params }: {
        params: {
            storeId: string
        }
    }
) {

    if (!params.storeId) {
        return new NextResponse("Store Id is required", { status: 400 ,headers:corsHeaders})
    }

    const { productIds, userId, address, phoneNumber } = await request.json();


    if (!userId) {
        return new NextResponse("User Id is required", { status: 400, headers: corsHeaders })
    }

    if (!productIds || productIds.length == 0) {
        return new NextResponse("Product Id(s) are required", { status: 400, headers: corsHeaders })
    }

    if (!address) {
        return new NextResponse("Address is required", { status: 400, headers: corsHeaders })
    }
    if (!phoneNumber) {
        return new NextResponse("Phone number is required", { status: 400, headers: corsHeaders })
    }

    try {
        await prismadb.order.create({
            data: {
                storeId: params.storeId,
                userId,
                isPaid: false,
                paymentType: 'COD',
                address,
                phoneNumber,
                orderItems: {
                    create: productIds.map((ProductId: string) => ({
                        product:{
                            connect: {
                                id: ProductId
                            }
                        }
                    }))
                }

            }
        });

        return new NextResponse("Order placed successfully", { status: 200,headers:corsHeaders })
    } catch (error) {
        console.log("[ORDER_POST]: ", error);
        return new NextResponse("Internal Server Error", { status: 500,headers:corsHeaders })
    }





}