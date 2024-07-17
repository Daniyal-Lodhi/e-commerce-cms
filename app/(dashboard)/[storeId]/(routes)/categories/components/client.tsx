'use client'

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/heading";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CategoryColumn, categoryColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "./api-lists";

interface CategoryClientProps {
    data: CategoryColumn[]
}


export const CategoryClient: React.FC<CategoryClientProps> = ({
    data
}) => {

    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Categories (${data.length})`}
                    description={'Manage categories for your store'}
                />

                <Button className="text-sm" onClick={() => router.push(`/${params.storeId}/categories/new`)} >
                    <Plus className="w-4 h-4 mr-2 " />
                    Add new
                </Button>

            </div>
            <Separator />
            <DataTable
                searchKey={'name'}
                data={data}
                columns={categoryColumns}
            />
            <Heading
                title={'API'}
                description={'API calls for billboards.'}
            />
            <Separator />
            <ApiList
                routeName="Categories"
                routeId="{CategoryId}"
            />
        </>
    )
}

export default CategoryClient;