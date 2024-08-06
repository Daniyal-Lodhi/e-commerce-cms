import ColorClient from "./components/client";
import prismadb from "@/lib/prismadb";

import { format } from "date-fns";


export const ColorPage = async (
    { params }: { params: { storeId: string } }
) => {
    const colors = await prismadb.color.findMany({
        where: {
            storeId:params.storeId
        },
        orderBy:{
            createdAt:'desc'
        }
    })

    const formattedColors = colors.map(({id,value,name,createdAt})=>{
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
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ColorClient data={formattedColors} />
            </div>

        </div>
    )
}


export default ColorPage;