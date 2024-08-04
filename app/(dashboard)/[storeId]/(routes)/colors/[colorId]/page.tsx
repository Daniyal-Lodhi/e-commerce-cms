
import prismadb from "@/lib/prismadb";
import { ColorFormPage } from "./components/ColorForm";

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