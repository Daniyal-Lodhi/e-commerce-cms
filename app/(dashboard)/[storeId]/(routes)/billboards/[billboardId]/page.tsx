
import BillboardFormPage from "./components/billboardsForm"
import prismadb from "@/lib/prismadb";

const BillboardPage = async ({params}:{
    params:{billboardId:string}
}) => {

    const billboard = await prismadb.billboards.findUnique({
        where: {
            id: params.billboardId
        }
    })


    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4" >
            <BillboardFormPage
                initialData={billboard}
            />
            </div>
        </div>
    )
}

export default BillboardPage