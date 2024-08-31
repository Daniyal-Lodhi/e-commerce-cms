
import { Metadata } from "next";
import CategoryFormPage from "./components/CategoryForm"
import prismadb from "@/lib/prismadb";



export async function generateMetadata({ params }: { params: { categoryId: string } }): Promise<Metadata> {
    const isEditMode = params.categoryId === "new";
  
    return {
      title: isEditMode ? "Create Category" : "Edit Category",
      description: "CMS Dashboard for managing categories",
    };
  }

const CategoryPage = async ({params}:{
    params:{categoryId:string, storeId:string} 
}) => {

    const categories = await prismadb.categories.findUnique({
        where: {
            id: params.categoryId
        }
    })

    const billboards = await prismadb.billboards.findMany({
        where: {
            storeId: params.storeId
        }
    })

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4" >
            <CategoryFormPage
            billboards={billboards}
                initialData={categories}
            />
            </div>
        </div>
    )
}

export default CategoryPage