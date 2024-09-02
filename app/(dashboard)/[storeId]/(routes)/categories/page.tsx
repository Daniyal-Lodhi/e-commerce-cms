import BillboardClient, { CategoryClient } from "./components/client";
import prismadb from "@/lib/prismadb";

import { format } from "date-fns";
import { Metadata } from "next";

export const metadata:Metadata = {
    title: 'Categories',
  }

const CategoryPage = async (
    { params }: { params: { storeId: string } }
) => {
    const categories = await prismadb.categories.findMany({
        where: {
            storeId:params.storeId
        },
        include:{
            billboard:true
        },
        orderBy:{
            createdAt:'desc'
        }
    })

    const formattedCategories = categories.map(({id,name,createdAt,billboard})=>{
        return {
            id,
            name,
            billboardLabel : billboard.label,
            createdAt: format(new Date(createdAt),'MMMM d,yyyy')
        }
    })
    return (
        <div className="flex-col" >
            <div className="flex-1 space-y-4 sm:p-8 p-4  pt-6">
                <CategoryClient data={formattedCategories} />
            </div>

        </div>
    )
}


export default CategoryPage;