'use client'
import { Color } from '@prisma/client'

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


interface ColorFormProps {
    initialData: Color | null;
}

const ColorSchema = z.object({
    value: z.string().min(1),
    name: z.string().min(1),
})
type ColorFormZ = z.infer<typeof ColorSchema>;


export const ColorFormPage: React.FC<ColorFormProps> = ({
    initialData
}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const router = useRouter();

    const title = initialData ? "Edit Color" : "Create Color";
    const description = initialData ? "Edit a Color" : "Add a new Color";
    const toastMessage = initialData ? "Color updated" : "Color created";
    const action = initialData ? "Save changes" : "Create Color";

    const form = useForm<ColorFormZ>({
        resolver: zodResolver(ColorSchema),
        defaultValues: {
            value: initialData?.value || '',
            name: initialData?.name || '',
        }
    })

    const onSubmit = async (data: ColorFormZ) => {

        setLoading(true);


        try {
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data)
            }
            else {
                await axios.post(`/api/${params.storeId}/colors`, data)
            }
            toast.success(toastMessage)
            router.push(`/${params.storeId}/colors`)
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
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
            toast.success("Color deleted")
            router.replace(`/${params.storeId}/colors`)
            router.refresh();
        } catch (error) {
            toast.error('Make sure you delete all the products and categories using this color.')
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


                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-8'>
                            <FormField
                                name='name'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} {...field} placeholder='Color name' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name='value'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Value</FormLabel>
                                        <div className='flex flex-row w-auto space-x-2' >
                                        <FormControl>
                                            <Input disabled={loading} {...field} placeholder='Color value' />
                                        </FormControl>
                                        <div className='h-10 w-12 rounded-md '
                                        style={{backgroundColor:field.value}}
                                        />
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>

                    </div>
                    <Button disabled={loading} type='submit' className='mt-4'  >{action}</Button>
                </form>
            </Form >
            <Separator />

        </>
    )
}


export default ColorFormPage;