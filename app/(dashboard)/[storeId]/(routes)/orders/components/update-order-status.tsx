'use client'

import UpdateModal from '@/components/Modals/update-status-modal'
import { Checkbox } from '@/components/ui/checkbox'
import { useSafeMood } from '@/hooks/use-safe-mood'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface UpdateOrderStatusProps {
    orderId: string,
    isPaid: boolean
    isCompleted?: boolean,
    completedAt: Date | null
}


const UpdateOrderStatus: React.FC<UpdateOrderStatusProps> = ({
    orderId,
    isPaid,
    isCompleted,
    completedAt
}) => {

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true)
    }, [])



    const params = useParams();
    const router = useRouter();
    const [check, setcheck] = useState(isCompleted || false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { safeMood } = useSafeMood();
    let freeze: boolean = false;
    if (!mounted) {
        return null
    }

    if ((completedAt !== null)) {
        let mins = 60 * 1000;
        if (new Date().getTime() - new Date(completedAt).getTime() < mins * 30) {
            freeze = false;
        }
        else {
            freeze = true;
        }
    }


    const updateStatus = async (checked: boolean) => {
        try {
            if (!safeMood) setcheck(checked)
            if (!completedAt) {
                const res = await axios.patch(`/api/${params.storeId}/orders/${orderId}`, {
                    completed: checked,
                    paid: undefined,
                    completedAt: true
                });
                // console.log(res.data)

            }
            else {
                const res = await axios.patch(`/api/${params.storeId}/orders/${orderId}`, {
                    completed: checked,
                    paid: undefined,
                });
                console.log(res.data)
            }
            setcheck(checked)
            // console.log(res.data)
            router.refresh()

        } catch (error: any) {
            setcheck(!checked)
            console.log(error.response.data)
            toast.error(error.response.data)
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    const onCheckChange = (checked: boolean) => {
        setcheck(!checked)
        if (safeMood) {
            setOpen(true);
        }
        else {
            updateStatus(checked);
        }
    }


    return (
        <div className='flex items-center gap-2' >
            <UpdateModal
                isOpen={open}
                loading={loading}
                onClose={() => setOpen(false)}
                onConfirm={() => updateStatus(!check)}
            />
            <div>
                {String(check)}
            </div>
            { !freeze &&  <Checkbox
                checked={check}
                className='disabled:text-gray-500 m-0  '
                title={check == true ? "" : "Marking complete will always set the paid status to true"}
                onCheckedChange={onCheckChange} />}
        </div>
    )
}

export default UpdateOrderStatus
