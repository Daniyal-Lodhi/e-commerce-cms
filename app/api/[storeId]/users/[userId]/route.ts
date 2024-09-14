import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: {
    params: { userId: string }
}) {

    if (!params.userId) {
        return new NextResponse("User id is required", { status: 400 });
    }
    try {

        const favProducts = await prismadb.favourite.findMany({
            where:{
                userId:params.userId,
                liked:true
            },
            include:{
                product:{
                    include:{
                        category:true,
                        size:true,
                        color:true,
                        images:true
                    }
                }
            }
        })
        return  NextResponse.json(favProducts,{status:200}) ;

    } catch (error) {
        console.log('[ADD_TO_FAV_POST:]', error)
        return new NextResponse("Internal server error", { status: 500 });

    }
}