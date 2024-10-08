'use client'

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/heading";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { BillboardColumn, billboardColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "./api-lists";

interface BillboardClientProps {
    data: BillboardColumn[]
}


export const BillboardClient: React.FC<BillboardClientProps> = ({
    data
}) => {

    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Billboards (${data.length})`}
                    description={'Manage billboards for your store'}
                />

                <Button className="text-sm" onClick={() => router.push(`/${params.storeId}/billboards/new`)} >
                    <Plus className="w-4 h-4 mr-2 " />
                    Add new
                </Button>

            </div>
            <Separator />
            <DataTable
            searchKey={'label'}
                data={data}
                columns={billboardColumns}
            />
            <Heading 
            title={'API'}
            description={'API calls for billboards.'}
            /> 
            <Separator />
            <ApiList
            routeName="billboards"
            routeId="{BillboardId}"
            />
        </>
    )
}

export default BillboardClient;