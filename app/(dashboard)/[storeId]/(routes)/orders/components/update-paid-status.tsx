'use client'

import { Checkbox } from '@/components/ui/checkbox'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface UpdateOrderStatusProps {
    orderId: string,
    isPaid: boolean,
    paymentType: string,
    isCompleted: boolean
}


const UpdatePaidStatus: React.FC<UpdateOrderStatusProps> = ({
    orderId,
    isPaid,
    paymentType,
    isCompleted
}) => {
    const params = useParams();
    const router = useRouter();
    const [check, setCheck] = useState(isPaid || false);
    useEffect(() => {
        setCheck(isPaid);
    }, [isCompleted])
    const onCheckChange = async (checked: boolean) => {
        try {
            setCheck(checked)
            const res = await axios.patch(`/api/${params.storeId}/orders/${orderId}`, {
                completed: undefined,
                paid: checked
            });
            // console.log(res.data)
            setCheck(checked)
            console.log(res.data)
            router.refresh();

        } catch (error: any) {
            setCheck(!checked)
            console.log(error)
        }
    }

    return (
        <div className='flex items-center gap-2' >
            <div>
                {String(check)}
            </div>
            {paymentType == "COD" && !isCompleted && <Checkbox
                checked={check}
                className='disabled:text-gray-500 m-0  '
                title={isPaid == false ? "Mark as paid" : "Mark as unpaid"}
                onCheckedChange={onCheckChange} />}
        </div>
    )
}

export default UpdatePaidStatus
