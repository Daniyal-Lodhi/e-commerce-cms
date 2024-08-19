import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { connect } from "http2";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";


export const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Allows any origin
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', // Allowed HTTP methods
    'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Allowed headers
};

// 1. To ensure authorization for the preflight request made by browser from cross domain.
export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(req: Request,
    { params }: { params: { storeId: string } }
) {
    const {productIds} = await req.json();

    if(!productIds || productIds.length == 0){
        return new NextResponse("Product Id(s) are required",{status:400})
    }

    // 2. Fetching selected items from product table
    const products = await prismadb.product.findMany({
        where:{
            id:{
                in:productIds
            }
        }
    })

    // 3. Creating line items array for stripe
    const line_items:Stripe.Checkout.SessionCreateParams.LineItem[] = []

    products.forEach((product)=>{
        line_items.push({
            quantity:1,
            price_data:{
                currency:"PKR",
                product_data:{
                    name:product.name,
                },
                unit_amount:product.price.toNumber() * 100 
            }
        });
    });

    // 4. Creating order
    const order = await prismadb.order.create({
        data:{
            storeId:params.storeId,
            isPaid:false,
            orderItems:{
                create: productIds.map((productId:string)=>({
                    product:{
                        connect:{
                            id:productId
                        }
                    }
                }))
            },
        }
    });

    // 5. Creating stripe checkout session

    const session = await stripe.checkout.sessions.create({
        line_items,
         mode:'payment',
         billing_address_collection:"required",
         phone_number_collection:{
            enabled:true
         },
         success_url:`${process.env.FRONTEND_STORE_URL}/cart?success=1`,
         cancel_url:`${process.env.FRONTEND_STORE_URL}/cart?cancelled=1`,
        //  we will use this metadata to update the isPaid status of the order
        metadata:{
            orderId:order.id,
        }
    });


    return NextResponse.json({url:session.url},{
        headers:corsHeaders
    });
}