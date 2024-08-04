'use client'

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/heading";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SizeColumn, SizeColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "./api-lists";

interface SizeClientProps { 
    data: SizeColumn[]
}


export const SizeClient: React.FC<SizeClientProps> = ({
    data
}) => {

    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Size (${data.length})`}
                    description={'Manage sizes for your store'}
                />

                <Button className="text-sm" onClick={() => router.push(`/${params.storeId}/sizes/new`)} >
                    <Plus className="w-4 h-4 mr-2 " />
                    Add new
                </Button>

            </div>
            <Separator />
            <DataTable
            searchKey={'name'}
                data={data}
                columns={SizeColumns}
            />
            <Heading 
            title={'API'}
            description={'API calls for sizes.'}
            />
            <Separator />
            <ApiList
            routeName="Size"
            routeId="{SizeId}"
            />
        </>
    )
}

export default SizeClient;