import GetGraphRevenue from "@/actions/get-graph-revenue";
import { getSales } from "@/actions/get-sales";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import Currency from "@/components/currency";
import { Heading } from "@/components/heading";
import OverviewCard from "@/components/overview-card";
import DashboardCard from "@/components/ui/dashboard-card";
import ViewStockCard from "@/components/ui/view-stock-card";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { CreditCard, HandCoins, } from "lucide-react";
import { redirect } from "next/navigation";




const Store = async (
    {params}: {params: {storeId: string} }
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
    // console.log(params.storeId)
    const sales = await getSales(params.storeId);
    const GraphRevenueData = await GetGraphRevenue(params.storeId);
    // console.log(GraphRevenueData)

    if (!store) {
        redirect('/');
    }
    return (
        <>
        { totalRevenue!=null && sales!=null && GraphRevenueData!=null && <div className="px-4 sm:px-6 py-4" >
            <div className="border-b pb-6 pt-2 mb-2 " >
                <Heading title="Dashboard" description={"Overview of your dashboard."} />
            </div>

            <div className="grid grid-cols-1  flex-wrap sm:grid-cols-2 gap-4 md:grid-cols-3 h-auto" >
                <DashboardCard
                classname="h-full"
                
                    title="Total Revenue"
                    value={<Currency value={totalRevenue} />}
                    icon={<HandCoins size={18} className="text-gray-700" />}
                />

                <DashboardCard
                    title="Sales"
                    value={`+${sales}`}
                    icon={<CreditCard size={18} className="text-gray-700" />}
                />
                <ViewStockCard />
            </div>
             {/* chart */}
                <div className="mt-3" >
                   { Object.keys(GraphRevenueData).length!==0 ? <OverviewCard GraphRevenueData={GraphRevenueData} /> : 
                   <OverviewCard GraphRevenueData={{}} /> 
                   }
                </div>

            
        </div>}
        </>
    )
}


export default Store;