import BillboardClient from "./components/client";
import prismadb from "@/lib/prismadb";

import { format } from "date-fns";


export const BillboardPage = async (
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

    const formattedBillboards = billboards.map(({id,label,createdAt})=>{
        // const formattedDate = format(new Date(createdAt), 'MMMM d, yyyy');
        return {
            id,
            label,
            createdAt: format(new Date(createdAt),'MMMM d,yyyy')
        }
    })
    return (
        <div className="flex-col" >
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardClient data={formattedBillboards} />
            </div>

        </div>
    )
}


export default BillboardPage;