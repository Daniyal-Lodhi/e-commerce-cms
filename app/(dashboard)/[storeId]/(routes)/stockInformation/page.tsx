import { Heading } from '@/components/heading'
import { Separator } from '@/components/ui/separator'
import prismadb from '@/lib/prismadb'
import React from 'react'
import StockClient from './components/stockClient'

const StockInformation = async (params:{storeId:string}) => {

  const products = await prismadb.product.findMany({
    where:{
      storeId:params.storeId,
    }
  })

  const formattedProducts = products.map((product)=>({
    id:product.id,
    name:product.name,
    quantity:product.quantity.toNumber()
  }))

  return (
    <div className='py-4 px-4 sm:px-6 md:px-8' >
      <Heading
      title={"Product Stocks"}
      description={"View your products stock information"}
      />
      <Separator className='mt-4 mb-5' />

      <StockClient
      data={formattedProducts}
      />
    </div>
  )
}

export default StockInformation
