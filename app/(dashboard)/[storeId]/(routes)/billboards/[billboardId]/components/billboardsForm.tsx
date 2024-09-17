'use client'
import { Billboards } from '@prisma/client'

import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import AlertModal from '@/components/Modals/alert-modal'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { Heading } from '@/components/heading'
import { Checkbox } from '@/components/ui/checkbox'
import UploadImage from '@/components/upload-image'


interface BillboardFormProps {
    initialData: Billboards | null;
}

const BillboardSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1),
    featured: z.boolean()
})
type BillboardFormZ = z.infer<typeof BillboardSchema>;


export const BillboardFormPage: React.FC<BillboardFormProps> = ({
    initialData
}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const router = useRouter();

    const title = initialData ? "Edit billboard" : "Create Billboard";
    const description = initialData ? "Edit a billboard" : "Add a new Billboard";
    const toastMessage = initialData ? "Billboard updated" : "Billboard created";
    const action = initialData ? "Save changes" : "Create Billboard";

    const form = useForm<BillboardFormZ>({
        resolver: zodResolver(BillboardSchema),
        defaultValues: {
            label: initialData?.label || '',
            imageUrl: initialData?.imageUrl || '',
            featured: initialData?.featured || false
        }
    })

    const onSubmit = async (data: BillboardFormZ) => {

        setLoading(true);


        try {
            var res;
            if (initialData) {
                res = await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data)
                console.log(data)
            }
            else {
                res = await axios.post(`/api/${params.storeId}/billboards`, data)
            }
            // console.log(res.data)
            toast.success(toastMessage)
            router.push(`/${params.storeId}/billboards`)
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
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
            toast.success('Billboard deleted')
            router.replace(`/${params.storeId}/billboards`)
            router.refresh();
        } catch (error) {
            toast.error('Make sure you delete all the products and categories using this billboard')
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
                        <FormField
                            control={form.control}
                            name='imageUrl'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Backgorund image</FormLabel>
                                    <FormControl>
                                        <UploadImage
                                            value={field.value ? [field.value] : []}
                                            disabled={loading}
                                            onChange={(url) => {
                                                // console.log(url)
                                                field.onChange(url)
                                            }}

                                            onRemove={() => field.onChange("")}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-8'>
                            <FormField
                                name='label'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Label</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} {...field} placeholder='Billboard name' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            >

                            </FormField>
                            <FormField
                                disabled={loading}

                                name='featured'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className='flex items-start space-x-3 p-4 border rounded-md'>
                                        <FormControl>
                                            <Checkbox
                                            disabled={loading}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className='mt-2' // Adjust height and width if needed
                                            />
                                        </FormControl>

                                        <div className='flex flex-col space-y-1 leading-none'>
                                            <FormLabel>Featured</FormLabel>
                                            <FormDescription className='text-sm text-slate-700'>
                                                This billboard will appear on the home page
                                            </FormDescription>
                                        </div>

                                    </FormItem>

                                )}
                            >
                            </FormField>
                        </div>

                    </div>
                    <Button disabled={loading} type='submit' className='mt-4'  >{action}</Button>
                </form>
            </Form >
            <Separator />

        </>
    )
}


export default BillboardFormPage;