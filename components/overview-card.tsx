'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { YearWiseGraphData } from '@/actions/get-graph-revenue'
import Overview from './overview'
import { SelectDataItem } from './ui/select-item'

interface OverviewCardProps {
    GraphRevenueData: YearWiseGraphData | {}
}

const OverviewCard: React.FC<OverviewCardProps> = ({
    GraphRevenueData
}) => {
    const [dataYear, setDataYear] = useState("");
    const [dataYears, setDataYears] = useState<string[]>([]);
    const [latestYearInData, setLatestYearInData] = useState<string>("");

    useEffect(() => {
        // Check if the data is not empty
        if (Object.keys(GraphRevenueData).length !== 0) {
            const years = Object.keys(GraphRevenueData);
            const latestYear = years[years.length - 1];

            setDataYears(years); // Set the list of available years
            setDataYear(latestYear); // Set the latest year as the default selected year
            setLatestYearInData(latestYear); // Store the latest year for future reference
        }
    }, [GraphRevenueData]); // Run this effect only when GraphRevenueData changes

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
                            latestYear={latestYearInData}
                            disabled={Object.keys(GraphRevenueData).length === 0}
                        />
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <Overview
                    data={GraphRevenueData}
                    disabled={Object.keys(GraphRevenueData).length === 0}
                    year={Number(dataYear)}
                />
            </CardContent>
        </Card>
    )
}

export default OverviewCard
