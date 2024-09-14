import prismadb from "@/lib/prismadb"



interface MonthWiseGraphData {
    name: string
    total: number
}
export type YearWiseGraphData= {
    [key: number]: MonthWiseGraphData[];
  };


const GetGraphRevenue = async (storeId: string) => {

    const paidOrders = await prismadb.order.findMany({
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
        },
        orderBy: {
            createdAt: 'asc'
        }
    })

    const monthlyRevenue: { [key: number]: { [key: number]: number } } = {} //{2024:{7:1},2025:{7:1}};
    const workYears: number[] = []
    for (const orders of paidOrders) {
        let month = orders.createdAt.getMonth();
        let year = orders.createdAt.getFullYear();
        workYears.push(year);

        if (!monthlyRevenue[year]) {
            monthlyRevenue[year] = {}; // Initialize the year with an empty array
        }

        // Ensure the month index exists
        if (!monthlyRevenue[year][month]) {
            monthlyRevenue[year][month] = 0; 
        }
        let revenueForOrder = 0;
        for (const orderItems of orders.orderItems) {
            revenueForOrder += orderItems.product.price.toNumber()
            monthlyRevenue[year][month] = (monthlyRevenue[year][month] || 0) + revenueForOrder;
        }
    }
    // console.log(monthlyRevenue)
    // graphData for month 
    let graphData: MonthWiseGraphData[] = [
        { name: "January", total: 0 },
        { name: "february", total: 0 },
        { name: "march", total: 0 },
        { name: "april", total: 0 },
        { name: "may", total: 0 },
        { name: "june", total: 0 },
        { name: "july", total: 0 },
        { name: "august", total: 0 },
        { name: "september", total: 0 },
        { name: "october", total: 0 },
        { name: "november", total: 0 },
        { name: "december", total: 0 },
    ];

    let yearWiseGraphData: YearWiseGraphData = {};
    for (const year of workYears) {
        // graph data for each working year
        // yearWiseGraphData[year] = graphData;
        yearWiseGraphData[year] = JSON.parse(JSON.stringify(graphData)); // Deep clone
    }
    // console.log(yearWiseGraphData);
    for (const i in monthlyRevenue) {
        // i is the year, the keys of monthlyRevenue Obj (2022,2024)
        const yearsOfMR = monthlyRevenue[i]
        for (const mKey of Object.keys(yearsOfMR)) {
            //mKey are the value of year (key) in monthlyRev Obj i.e. { '2022': { '9': 1500 }, '2024': { '7': 1500 } }
            // console.log(i, mKey, " = ", yearsOfMR[parseInt(mKey)])
            // console.log(yearOfMR[parseInt(mKey)])
            // console.log(yearWiseGraphData[i][parseInt(mKey)])
            yearWiseGraphData[parseInt(i)][parseInt(mKey)].total = yearsOfMR[parseInt(mKey)]
        }
    }
    // console.log(yearWiseGraphData);


    return yearWiseGraphData;

}


// const currentYear = new Date().getFullYear();
// export const dummyYearWiseData:YearWiseGraphData={
//     [currentYear]:[
//         { name: 'January', total: 0 },
//         { name: 'february', total: 0 },
//         { name: 'march', total: 0 },
//         { name: 'april', total: 0 },
//         { name: 'may', total: 0 },
//         { name: 'june', total: 0 },
//         { name: 'july', total: 0 },
//         { name: 'august', total: 0 },
//         { name: 'september', total: 0 },
//         { name: 'october', total: 0 },
//         { name: 'november', total: 0 },
//         { name: 'december', total: 0 }
//       ]
// }

export default GetGraphRevenue;