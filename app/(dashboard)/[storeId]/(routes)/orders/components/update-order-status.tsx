import { Checkbox } from '@/components/ui/checkbox'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

interface UpdateOrderStatusProps {
    orderId: string,
    isPaid: boolean
    isCompleted: boolean
}


const UpdateOrderStatus: React.FC<UpdateOrderStatusProps> = ({
    orderId,
    isPaid,
    isCompleted
}) => {
    const router = useRouter();
    const params = useParams();
    const onCheckChange = async (checked: boolean) => {
        var completed = isCompleted;
        if (checked == true) {
            completed = true;

        }
        else
            completed = false;

        const res = await axios.patch(`/api/${params.storeId}/orders/${orderId}`, { completed });
        console.log(res.data)

        router.refresh();
    }

    return (
        <div className='flex items-center' >
            <Checkbox
                defaultValue={Number(isCompleted)}
                disabled={isPaid ? false : true}
                className='disabled:text-gray-500 m-0  '
                title={isPaid ? "" : "Order can not be completed until it is paid"}
                onCheckedChange={onCheckChange} />
        </div>
    )
}

export default UpdateOrderStatus
