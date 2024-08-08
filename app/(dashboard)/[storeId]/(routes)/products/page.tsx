import ProductClient from "./components/client";
import prismadb from "@/lib/prismadb";

import { format } from "date-fns";


export const ProductsPage = async (
    { params }: { params: { storeId: string } }
) => {
    const products = await prismadb.product.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            images: true,
            size: true,
            category: true,
            color: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formattedProducts = products.map((product) => {
        // const formattedDate = format(new Date(createdAt), 'MMMM d, yyyy');
        return {
            id: product.id,
            name: product.name,
            price: product.price.toNumber() ,
            isArchived: product.isArchived,
            isFeatured: product.isFeatured,
            size: product.size.name,
            color: product.color.name,
            colorValue:product.color.value,
            category: product.category.name,
            createdAt: format(new Date(product.createdAt), 'MMMM d,yyyy'),
        }
    })
    return (
        <div className="flex-col" >
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient data={formattedProducts} />
            </div>

        </div>
    )
}


export default ProductsPage;