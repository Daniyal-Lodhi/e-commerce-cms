
import CategoryFormPage from "./components/CategoryForm"
import prismadb from "@/lib/prismadb";

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