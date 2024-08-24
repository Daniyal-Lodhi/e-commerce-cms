import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { cn } from '@/lib/utils'

interface DashboardCardProps{
    title:string
    value:React.ReactElement | string | number
    icon:React.ReactElement
    classname?:string

}

const DashboardCard:React.FC<DashboardCardProps> = ({
    title,
    value,
    icon,
    classname
}) => {
  return (
    <div className='p-2 '>
      <Card className='h-full' >
        <CardHeader>
            <CardTitle className='flex justify-between items-center font-bold' >
                <div className='text-sm' >
                    {title}
                </div>
                <div>
                    {icon}
                </div>
            </CardTitle>
        </CardHeader>
        <CardContent className={cn('font-bold text-2xl',classname)} >
            {value}
        </CardContent>

      </Card>
    </div>
  )
}

export default DashboardCard
