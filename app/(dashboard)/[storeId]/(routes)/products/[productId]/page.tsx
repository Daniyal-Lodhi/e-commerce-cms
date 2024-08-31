import { Metadata } from "next";
import ProductFormPage from "./components/productsForm";
import prismadb from "@/lib/prismadb";


export async function generateMetadata({ params }: { params: { productId: string } }): Promise<Metadata> {
    const isEditMode = params.productId === "new";
  
    return {
      title: isEditMode ? "Create Product" : "Edit Product",
      description: "CMS Dashboard for managing products",
    };
  }

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
   const productJson = JSON.parse(JSON.stringify(product)) ;
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
                initialData={productJson}
                category = {categories}
                size = {sizes}
                color = {colors}
                
            />
            </div>
        </div>
    )
}

export default ProductPage