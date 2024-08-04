'use client'
import { Size } from '@prisma/client'

import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import AlertModal from '@/components/Modals/alert-modal'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { Heading } from '@/components/heading'


interface SizeFormProps {
    initialData: Size | null;
}

const SizeSchema = z.object({
    value: z.string().min(1),
    name: z.string().min(1),
})
type SizeFormZ = z.infer<typeof SizeSchema>;


export const SizeFormPage: React.FC<SizeFormProps> = ({
    initialData
}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const router = useRouter();

    const title = initialData ? "Edit Size" : "Create Size";
    const description = initialData ? "Edit a Size" : "Add a new Size";
    const toastMessage = initialData ? "Size updated" : "Size created";
    const action = initialData ? "Save changes" : "Create Size";

    const form = useForm<SizeFormZ>({
        resolver: zodResolver(SizeSchema),
        defaultValues: {
            value: initialData?.value || '',
            name: initialData?.name || '',
        }
    })

    const onSubmit = async (data: SizeFormZ) => {

        setLoading(true);


        try {
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data)
            }
            else {
                await axios.post(`/api/${params.storeId}/sizes`, data)
            }
            toast.success(toastMessage)
            router.push(`/${params.storeId}/sizes`)
            router.refresh(); // syncs changes in the router by refreshing it, as in this case synced the name of store after update.
        } catch (error) {
            toast.error("Something went wrong.")
            console.log(error)
        }
        finally {
            setLoading(false);
        }
    }
    const onConfirmDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
            toast.success("Size deleted")
            router.replace(`/${params.storeId}/sizes`)
            router.refresh();
        } catch (error) {
            toast.error('Make sure you delete all the products and categories using this size.')
        }
        finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>

            <AlertModal loading={loading} isOpen={open} onClose={() => setOpen(false)} onConfirm={onConfirmDelete} />
            <div className='flex items-center justify-between' >
                <Heading
                    title={title}
                    description={description}
                />
                {initialData && (
                    <Button
                        disabled={loading}
                        variant={"destructive"}
                        size={'icon'}
                        onClick={() => setOpen(true)}
                    >
                        <Trash className='h-4 w-4' />
                    </Button>
                )}

            </div>
            <Separator />
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} >
                    <div className='flex-col space-y-4' >


                        <div className='grid grid-cols-3 gap-8'>
                            <FormField
                                name='name'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} {...field} placeholder='Size name' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            ></FormField>

                            <FormField
                                name='value'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Value</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} {...field} placeholder='Size value' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            ></FormField>

                        </div>

                    </div>
                    <Button disabled={loading} type='submit' className='mt-4'  >{action}</Button>
                </form>
            </Form >
            <Separator />

        </>
    )
}


export default SizeFormPage;