'use client'

import React, { useEffect, useState } from 'react'
import DashboardCard from './dashboard-card'
import { Box } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from './button'

const ViewStockCard = () => {

    const [mounted,setMounted] = useState(false);
    
    useEffect(()=>{
        setMounted(true)
    },[]);

    if(!mounted){
        return null;
    }

    const router = useRouter();
    const params = useParams();

  return (
    <div className='m-0 cursor-pointer' 
    onClick={()=>router.push(`/${params.storeId}/stockInformation`)}
    >
 
      <DashboardCard 
      title="Product Stock"
      value={"View Stock Info ->"}
      icon={<Box size={18} />}
      />
    </div>
  )
}

export default ViewStockCard
