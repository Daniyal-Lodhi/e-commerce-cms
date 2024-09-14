
import { corsHeaders } from "@/app/api/corsHeaders";
import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server"

export const GET = async (req: Request,
    { params }: {
        params: { userId: string }
    }
) => {

    try {
        if (!params.userId) {
            return new NextResponse("User Id is required", { status: 400 })
        }

        const { searchParams } = new URL(req.url);

        const status = searchParams.get('status') || undefined;
        console.log(status);


        var orders;
        if (status == "ongoing") {
            orders = await prismadb.order.findMany({
                where: {
                    userId: params.userId,
                    completed: false
                },
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
        }
        else if (status == "previous") {
            orders = await prismadb.order.findMany({
                where: {
                    userId: params.userId,
                    completed: true
                },
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
        }
        else {
            orders = await prismadb.order.findMany({
                where: {
                    userId: params.userId,
                },
                include: {
                    orderItems: {
                        include: {
                            product: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
        }



        return NextResponse.json(orders, { status: 200 })
    } catch (error) {
        console.log('[USER_ORDER_GET]:', error)
        return new NextResponse("Internal server error", { status: 500 })
    }



}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}