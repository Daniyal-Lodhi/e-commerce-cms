'use client'

import React, { useEffect, useState } from 'react'
import DashboardCard from './dashboard-card'
import { Box } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

const ViewStockCard = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    setIsMounted(true); // Set to true when the component is mounted on the client side
  }, []);

  if (!isMounted) {
    return null; // Avoid rendering mismatched content during SSR
  }

  return (
    <div className='m-0 cursor-pointer' 
      onClick={() => router.push(`/${params.storeId}/stockInformation`)}
    >
      <DashboardCard 
        title="Product Stock"
        value="View Stock Info ->"
        icon={<Box size={18} />}
      />
    </div>
  );
}

export default ViewStockCard;
