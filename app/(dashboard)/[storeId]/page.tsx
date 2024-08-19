import { getSales } from "@/actions/get-sales";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import Currency from "@/components/currency";
import { Heading } from "@/components/heading";
import DashboardCard from "@/components/ui/dashboard-card";
import ViewStockCard from "@/components/ui/view-stock-card";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { Box, CreditCard, HandCoins, } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";




export const Store = async (
    params: { storeId: string }
) => {
    const { userId } = auth();
    if (!userId) {
        redirect('/sign-in')
    }

    const store = await prismadb.store.findFirst({
        where: {
            userId,
            id: params.storeId
        }
    });

    const totalRevenue = await getTotalRevenue(params.storeId);
    const sales = await getSales(params.storeId);

    if (!store) {
        redirect('/');
    }
    return (
        <div className="px-4 sm:px-6 py-4" >
            <div className="border-b pb-6 pt-2 mb-2 " >
                <Heading title="Dashboard" description={"Overview of your dashboard."} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-3 h-auto" >
                <DashboardCard
                    title="Total Revenue"
                    value={<Currency value={totalRevenue} />}
                    icon={<HandCoins size={18} className="text-gray-700" />}
                />
                
                <DashboardCard
                    title="Sales"
                    value={`+${sales}`}
                    icon={<CreditCard size={18} className="text-gray-700" />}
                />

                <ViewStockCard/>

                
            </div>
        </div>
    )
}


export default Store;