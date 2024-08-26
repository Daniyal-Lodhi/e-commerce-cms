import { Checkbox } from '@/components/ui/checkbox'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

interface UpdateOrderStatusProps {
    orderId: string,
    isPaid: string
    isCompleted: string
}


const UpdateOrderStatus: React.FC<UpdateOrderStatusProps> = ({
    orderId,
    isPaid,
}) => {
    const router = useRouter();
    const params = useParams();
    const onCheckChange = async (checked: boolean) => {
        
        try {
            const res = await axios.patch(`/api/${params.storeId}/orders/${orderId}`, {
                completed: checked
            });
            // console.log(res.data)
    
            router.refresh();
        } catch (error:any) {
            console.log(error?.response?.data)
        }
    }

    return (
        <div className='flex items-center' >
            <Checkbox
            defaultChecked={isPaid == 'true'}
                disabled={isPaid=='false' ? true : false}
                className='disabled:text-gray-500 m-0  '
                title={isPaid=='false' ? "Order can not be completed until it is paid" : "Mark as completed"}
                onCheckedChange={onCheckChange} />
        </div>
    )
}

export default UpdateOrderStatus
