import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request,
    { params }: {
        params: {
            orderId: string
        }
    }
) => {

    if (!params.orderId) {
        return new NextResponse("Order Id is required", { status: 400 })
    }
    const { completed, paid, completedAt } = await req.json();
    try {
        const order = await prismadb.order.findUnique({
            where: {
                id: params.orderId
            }
        })
        if (!order) {
            return new NextResponse("Order not found", { status: 404 });
        }
        // for order completion state update
        if (completed !== undefined) {
            if (completedAt) {
                // first time complete enabled

                await prismadb.order.update({
                    where: {
                        id: params.orderId
                    },
                    data: {
                        completed,
                        isPaid: true,  
                        completedAt: new Date()
                    }
                })
                return new NextResponse(`Order status updated => ${completed}`)

            }
            else {
                // further attempt to update status due to mistakes
                const orderCreationTime = new Date(order.createdAt).getTime();
                const currentTime = new Date().getTime();
                const timeDiffInMinutes = (currentTime - orderCreationTime) / (60 * 1000);
                if (timeDiffInMinutes < 30) {
                    await prismadb.order.update({
                        where: {
                            id: params.orderId
                        },
                        data: {
                            completed,
                            isPaid: true,
                        }
                    })
                    return new NextResponse(`Order status updated => ${completed}`)
                }
                else {
                    return new NextResponse('Cannot change completion status after 30 mins', { status: 400 })

                }
            }
        }
        // for order paid state update

        else if (paid !== undefined) {
            if (order?.paymentType === "CARD") {
                return new NextResponse("Cannot change the paid status since it is already paid by card", { status: 400 })
            }
            await prismadb.order.update({
                where: {
                    id: params.orderId
                },
                data: {
                    isPaid: paid
                }
            })
            return new NextResponse(`Order paid status updated => ${paid}`)



        }
    } catch (error) {
        console.log("[ORDER_PATCH:]", error);
        return new NextResponse("Some Error occured");
    }
}