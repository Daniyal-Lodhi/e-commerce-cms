import React from 'react'
import { ProductColumn, productColumns } from './stock-column'
import { DataTable } from '@/components/ui/data-table'


interface StockClientProps{
    data:ProductColumn[]
}

const StockClient:React.FC<StockClientProps> = ({data}) => {
  return (
    <div>
      <DataTable
            searchKey={'name'}
                data={data}
                columns={productColumns}
            />
    </div>
  )
}

export default StockClient
