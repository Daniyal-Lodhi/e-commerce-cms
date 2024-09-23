
import { Metadata } from "next";
import BillboardFormPage from "./components/billboardsForm"
import prismadb from "@/lib/prismadb";




  export async function generateMetadata({ params }: { params: { billboardId: string } }): Promise<Metadata> {
    const isEditMode = params.billboardId === "new";
  
    return {
      title: isEditMode ? "Create Billboard" : "Edit Billboard",
      description: "CMS Dashboard for managing billboards",
    };
  }


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
            <div className="flex-1 sm:p-8 p-4 pt-6 space-y-4" >
            <BillboardFormPage
                initialData={billboard}
            />
            </div>
        </div>
    )
}

export default BillboardPage