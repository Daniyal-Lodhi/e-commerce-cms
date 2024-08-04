'use client'

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/heading";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ColorColumn, ColorColumns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "./api-lists";

interface ColorClientProps { 
    data: ColorColumn[]
}


export const ColorClient: React.FC<ColorClientProps> = ({
    data
}) => {

    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Color (${data.length})`}
                    description={'Manage colors for your store'}
                />

                <Button className="text-sm" onClick={() => router.push(`/${params.storeId}/colors/new`)} >
                    <Plus className="w-4 h-4 mr-2 " />
                    Add new
                </Button>

            </div>
            <Separator />
            <DataTable
            searchKey={'name'}
                data={data}
                columns={ColorColumns}
            />
            <Heading 
            title={'API'}
            description={'API calls for colors.'}
            />
            <Separator />
            <ApiList
            routeName="Color"
            routeId="{ColorId}"
            />
        </>
    )
}

export default ColorClient;