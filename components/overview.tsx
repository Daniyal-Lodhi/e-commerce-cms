'use client'
import { YearWiseGraphData } from '@/actions/get-graph-revenue'
import { useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'


interface OverviewProps {
  data: YearWiseGraphData
  year : number
  disabled:boolean
}

const Overview: React.FC<OverviewProps> = ({ data,year,disabled }) => {
 
  return (
    <ResponsiveContainer width="100%" height={350} className=' pt-2' >
      { disabled? <div className='h-full flex items-center justify-center   text-lg text-gray-500 ' >Seems like you have not made any sales yet.</div> :
       <BarChart
        data={data[Number(year)]}
        margin={{ top: 20 }}
      >
        <XAxis
          dataKey="name"
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis

          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `PKR ${value}`}
        />
        <Bar dataKey="total" fill="#3498db" radius={[4, 4, 0, 0]} />
      </BarChart>}
    </ResponsiveContainer>
  )
}

export default Overview
