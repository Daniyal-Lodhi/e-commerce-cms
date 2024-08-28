'use client'

import { Checkbox } from '@/components/ui/checkbox'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'

interface UpdateOrderStatusProps {
    orderId: string,
    isPaid: boolean
    isCompleted?: boolean,
}


const UpdateOrderStatus: React.FC<UpdateOrderStatusProps> = ({
    orderId,
    isPaid,
    isCompleted
}) => {
    const params = useParams();
    const router = useRouter();
    const [check,setCheck] = useState(String(isCompleted));
    const onCheckChange = async (checked: boolean) => {
        try {
            const res = await axios.patch(`/api/${params.storeId}/orders/${orderId}`, {
                completed: checked,
                paid:undefined
            });
            // console.log(res.data)
            setCheck(String(checked))
            router.refresh()
    
        } catch (error:any) {
            console.log(error?.response?.data)
        }
    }

    return (
        <div className='flex items-center gap-2' >
            <div>
                {check}
            </div>
            <Checkbox
            defaultChecked={isCompleted === true}
                className='disabled:text-gray-500 m-0  '
                title={check=="true"?"":"Marking complete will always set the paid status to true"}
                onCheckedChange={onCheckChange} />
        </div>
    )
}

export default UpdateOrderStatus
