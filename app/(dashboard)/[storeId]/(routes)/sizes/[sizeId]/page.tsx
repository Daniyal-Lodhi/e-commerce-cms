import prismadb from "@/lib/prismadb";
import SizeFormPage from "./components/SizesForm";
import { Metadata } from "next";




export async function generateMetadata({ params }: { params: { sizeId: string } }): Promise<Metadata> {
    const isEditMode = params.sizeId === "new";
  
    return {
      title: isEditMode ? "Create Size" : "Edit Size",
      description: "CMS Dashboard for managing sizes",
    };
  }




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
            <div className="flex-1 sm:p-8 p-4 pt-6 space-y-4" >
            <SizeFormPage
                initialData={size}
            />
            </div>
        </div>
    )
}

export default SizePage