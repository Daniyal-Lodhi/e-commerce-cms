
import ProductFormPage from "./components/productsForm"
import prismadb from "@/lib/prismadb";

const ProductPage = async ({params}:{
    params:{storeId:string,productId:string}
}) => {

    const product = await prismadb.product.findUnique({
        where: {
            id: params.productId
        },
        include:{
            images:true ,
        }
    })

    const categories = await prismadb.categories.findMany({
        where:{
            storeId:params.storeId
        }
    })

    const sizes = await prismadb.size.findMany({
        where:{
            storeId:params.storeId
        }
    })

    const colors = await prismadb.color.findMany({
        where:{
            storeId:params.storeId
        }
    })



    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4" >
            <ProductFormPage
                initialData={product}
                category = {categories}
                size = {sizes}
                color = {colors}
                
            />
            </div>
        </div>
    )
}

export default ProductPage