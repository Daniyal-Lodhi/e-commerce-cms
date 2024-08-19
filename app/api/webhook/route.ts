import prismadb from "@/lib/prismadb";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// will handle stripe checkout response 

export async function POST (request:NextRequest) {
    const  body = await request.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = Stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error:any) {
        console.log()
        return new NextResponse(`Webhook error: ,${error.message}`,{status:400});
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const address = session?.customer_details?.address;

    const addressComponents = [
        address?.line1,
        address?.line2,
        address?.city,
        address?.postal_code,
        address?.country,
    ]

    const addressString = addressComponents.filter((c)=>c!==null).join(", ");

    if(event.type == "checkout.session.completed"){
        const order = await prismadb.order.update({
            where:{
                id:session?.metadata?.orderId
            },
            data:{
                isPaid:true,
                address:addressString,
                phoneNumber:session?.customer_details?.phone 
            },
            include:{
                orderItems:true
            }
        })

        
        const productIds = order.orderItems.map((orderItem)=> orderItem.productId);


        await prismadb.product.updateMany({
            where:{
                id:{
                    in:productIds
                }
            },
            data:{
                quantity:{
                    decrement:1
                },
            }
        })
    }

    return new NextResponse(null,{status:200});


} 