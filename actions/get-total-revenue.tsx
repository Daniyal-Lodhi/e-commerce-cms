import prismadb from "@/lib/prismadb"



export const getTotalRevenue = async (storeId: string) => {
    const orders = await prismadb.order.findMany({
        where: {
            storeId,
            isPaid: true
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        }
    });

    const totalRevenue = orders.reduce((Total, order) => {
        const EachOrderPrice = order.orderItems.reduce((orderTotal, orderItem) => {
            return orderTotal + orderItem.product.price.toNumber();
        }, 0)
        return Total + EachOrderPrice;
    }, 0)

    return totalRevenue;
}

