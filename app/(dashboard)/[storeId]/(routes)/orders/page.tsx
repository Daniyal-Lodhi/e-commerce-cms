import prismadb from "@/lib/prismadb";

import { format } from "date-fns";
import { OrderColumn } from "./components/columns";
import OrderClient from "./components/client";


export const OrderPage = async (
    { params }: { params: { storeId: string } }
) => {
    const orders = await prismadb.order.findMany({
        where: {
            storeId:params.storeId
        },
        include:{
            orderItems:{
                include:{
                    product:true
                }
            }
        },
        orderBy:{
            createdAt:'desc'
        }
    })

    const formattedOrders:OrderColumn[] = orders.map((order)=>{
        return {
            id: order.id,
            products:order.orderItems.map((orderItem)=>orderItem.product.name).join(", ") ,
            totalPrice :  order.orderItems.reduce((totalPrice,currentValue)=>{
                return totalPrice + Number(currentValue.product.price)
            },0),
            phoneNumber: order.phoneNumber || "",
            completed:order.completed,
            address: order.address,
            paymentType:order.paymentType,
            paid:order.isPaid ,
            createdAt: format(new Date(order.createdAt),'MMMM d,yyyy')
        }
    })
    return (
        <div className="flex-col" >
            <div className="flex-1 space-y-4 p-8 pt-6">
                <OrderClient data={formattedOrders} />
            </div>

        </div>
    )
}


export default OrderPage;