'use client'

import { Checkbox } from '@/components/ui/checkbox'
import axios from 'axios'
import { useParams,useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface UpdateOrderStatusProps {
    orderId: string,
    isPaid: boolean,
    paymentType:string,
    isCompleted:boolean
}


const UpdatePaidStatus: React.FC<UpdateOrderStatusProps> = ({
    orderId,
    isPaid,
    paymentType,
    isCompleted
}) => {
    const params = useParams();
    const router = useRouter();
    const [check,setCheck] = useState(String(isPaid));
    useEffect(()=>{
        setCheck(String(isPaid));
    },[isCompleted])
    const onCheckChange = async (checked: boolean) => {
        try {
            const res = await axios.patch(`/api/${params.storeId}/orders/${orderId}`, {
                completed: undefined,
                paid:checked
            });
            // console.log(res.data)
            setCheck(String(checked))
            router.refresh();
    
        } catch (error:any) {
            console.log(error?.response?.data)
        }
    }

    return (
        <div className='flex items-center gap-2' >
            <div>
                {check}
            </div>
            { paymentType == "COD" && !isCompleted && <Checkbox
            defaultChecked={isPaid === true}
                className='disabled:text-gray-500 m-0  '
                title={isPaid==false ? "Mark as paid" : "Mark as unpaid"}
                onCheckedChange={onCheckChange} />}
        </div>
    )
}

export default UpdatePaidStatus
