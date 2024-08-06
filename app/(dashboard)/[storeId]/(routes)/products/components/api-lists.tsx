'use BillboardClient'

import { ApiAlert } from "@/components/ui/api-alert"
import { useOrigin } from "@/hooks/use-origin"
import { useParams } from "next/navigation"

interface ApiListProps {
    routeName: string
    routeId: string
}


export const ApiList: React.FC<ApiListProps> = ({
    routeName,
    routeId
}) => {

    const params = useParams();
    const origin = useOrigin();


    const baseUrl = `${origin}/api/${params.storeId}`

    return (
        <>
            <ApiAlert
                title="GET"
                variant="public"
                description={`${baseUrl}/${routeName}`}
            />

            <ApiAlert
                title="GET"
                variant="public"
                description={`${baseUrl}/${routeName}/${routeId}`}
            />

            <ApiAlert
                title="POST"
                variant="admin"
                description={`${baseUrl}/${routeName}`}
            />

            <ApiAlert
                title="PATCH"
                variant="admin"
                description={`${baseUrl}/${routeName}/${routeId}`}
            />
            <ApiAlert
                title="DELETE"
                variant="admin"
                description={`${baseUrl}/${routeName}/${routeId}`}
            />
        </>
    )
}