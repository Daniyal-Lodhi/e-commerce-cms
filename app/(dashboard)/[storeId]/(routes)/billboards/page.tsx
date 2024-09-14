import BillboardClient from "./components/client";
import prismadb from "@/lib/prismadb";

import { format } from "date-fns";
import { Metadata } from "next";


export const metadata:Metadata = {
    title: 'Billboards',
  }

const BillboardPage = async (
    { params }: { params: { storeId: string } }
) => {
    const billboards = await prismadb.billboards.findMany({
        where: {
            storeId:params.storeId
        },
        orderBy:{
            createdAt:'desc'
        }
    })

    const formattedBillboards = billboards.map(({id,label,createdAt,featured})=>{
        // const formattedDate = format(new Date(createdAt), 'MMMM d, yyyy');
        return {
            id,
            label,
            featured,
            createdAt: format(new Date(createdAt),'MMMM d,yyyy')
        }
    })
    return (
        <div className="flex-col" >
            <div className="flex-1 space-y-4 sm:p-8 p-4 pt-6">
                <BillboardClient data={formattedBillboards} />
            </div>

        </div>
    )
}


export default BillboardPage;