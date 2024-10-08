import SizeClient from "./components/client";
import prismadb from "@/lib/prismadb";
import { Metadata } from "next";
import { format } from "date-fns";


export const metadata:Metadata = {
    title: 'Sizes',
  }

const SizePage = async (
    { params }: { params: { storeId: string } }
) => {
    const sizes = await prismadb.size.findMany({
        where: {
            storeId:params.storeId
        },
        orderBy:{
            createdAt:'desc'
        }
    })

    const formattedSize = sizes.map(({id,value,name,createdAt})=>{
        // const formattedDate = format(new Date(createdAt), 'MMMM d, yyyy');
        return {
            id,
            value,
            name,
            createdAt: format(new Date(createdAt),'MMMM d,yyyy')
        }
    })
    return (
        <div className="flex-col" >
            <div className="flex-1 space-y-4 sm:p-8 p-4 pt-6">
                <SizeClient data={formattedSize} />
            </div>

        </div>
    )
}


export default SizePage;