import prismadb from "@/lib/prismadb";
import { ColorFormPage } from "./components/ColorForm";
import { Metadata } from "next";


export async function generateMetadata({ params }: { params: { colorId: string } }): Promise<Metadata> {
    const isEditMode = params.colorId === "new";
  
    return {
      title: isEditMode ? "Create Color" : "Edit Color",
      description: "CMS Dashboard for managing colors",
    };
  }

const ColorPage = async ({params}:{
    params:{colorId:string}
}) => {

    const color = await prismadb.color.findUnique({
        where: {
            id: params.colorId
        }
    })


    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4" >
            <ColorFormPage
                initialData={color}
            />
            </div>
        </div>
    )
}

export default ColorPage