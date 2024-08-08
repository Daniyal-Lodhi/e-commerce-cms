'use client'

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/heading";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ProductColumn, productColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "./api-lists";
import { Categories, Image, Size ,Color } from "@prisma/client";

interface ProductClientProps {
    data: ProductColumn[] 
}


export const ProductClient: React.FC<ProductClientProps> = ({
    data
}) => {

    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Products (${data.length})`}
                    description={'Manage products for your store'}
                />

                <Button className="text-sm" onClick={() => router.push(`/${params.storeId}/products/new`)} >
                    <Plus className="w-4 h-4 mr-2 " />
                    Add new
                </Button>

            </div>
            <Separator />
            <DataTable
            searchKey={'name'}
                data={data}
                columns={productColumns}
            />
            <Heading 
            title={'API'}
            description={'API calls for products.'}
            /> 
            <Separator />
            <ApiList
            routeName="products"
            routeId="{ProductId}"
            />
        </>
    )
}

export default ProductClient;