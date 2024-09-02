'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { YearWiseGraphData } from '@/actions/get-graph-revenue'
import Overview from './overview'
import { SelectDataItem } from './ui/select-item'

interface OverviewCardProps {
    GraphRevenueData: YearWiseGraphData
}

const OverviewCard: React.FC<OverviewCardProps> = ({
    GraphRevenueData
}) => {
    const dataYears = Object.keys(GraphRevenueData);
    const LatestYearInData = dataYears[dataYears.length - 1]
    const [dataYear, setDataYear] = useState(LatestYearInData)

    return (
        <Card className="col-span-3 mx-2 ">
            <CardHeader>
                <CardTitle>
                    <div className='flex items-center gap-3' >
                        Overview
                        <SelectDataItem
                            data={dataYears}
                            title='Select Year'
                            setData={setDataYear}
                            latestYear={LatestYearInData}
                        />
                    </div>
                    {Object.keys(GraphRevenueData).length == 0 && <div className=' mt-1 text-sm text-gray-700 font-normal ' >Seems like you have not made any sales yet.</div>}

                </CardTitle>

            </CardHeader>
            <CardContent className="pl-2">
                <Overview data={GraphRevenueData}
                    year={Number(dataYear)} />
            </CardContent>
        </Card>
    )
}

export default OverviewCard
