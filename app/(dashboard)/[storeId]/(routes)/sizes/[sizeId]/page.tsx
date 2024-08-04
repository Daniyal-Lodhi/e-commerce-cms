
import prismadb from "@/lib/prismadb";
import SizeFormPage from "./components/SizesForm";

const SizePage = async ({params}:{
    params:{sizeId:string}
}) => {

    const size = await prismadb.size.findUnique({
        where: {
            id: params.sizeId
        }
    })


    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4" >
            <SizeFormPage
                initialData={size}
            />
            </div>
        </div>
    )
}

export default SizePage