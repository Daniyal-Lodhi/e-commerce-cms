import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request,
    { params }: {
        params: {
            orderId: string
        }
    }
) => {
    const { completed } = await req.json();
    try {
        await prismadb.order.update({
            where: {
                id: params.orderId
            },
            data: {
                completed
            }
        })
        return new NextResponse(`Order status updated => ${completed}`)
    } catch (error) {
        console.log("[ORDER_PATCH:]", error);
        return new NextResponse("Some Error occured");
    }
}