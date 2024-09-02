'use client'
import { Billboards, Categories } from '@prisma/client'

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
import { ApiAlert } from '@/components/ui/api-alert'
import { useOrigin } from '@/hooks/use-origin'
import { Heading } from '@/components/heading'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface CategoryFormProps {
    initialData: Categories | null;
    billboards: Billboards[] | null;
}

const CategorySchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1),
})
type CategoryFormZ = z.infer<typeof CategorySchema>;


export const CategoryFormPage: React.FC<CategoryFormProps> = ({
    initialData,
    billboards
}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const router = useRouter();
   
    const title = initialData ? "Edit Category" : "Create Category";
    const description = initialData ? "Edit a Category" : "Add a new Category";
    const toastMessage = initialData ? "Category updated" : "Category created";
    const action = initialData ? "Save changes" : "Create Category";

    const form = useForm<CategoryFormZ>({
        resolver: zodResolver(CategorySchema),
        defaultValues: initialData || {
            name: '',
            billboardId: ''
        }
    })

    const onSubmit = async (data: CategoryFormZ) => {
        // console.log(data)
        setLoading(true);
        try {
            var res;
            if (initialData) {
                res = await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data)
            }
            else {
                res = await axios.post(`/api/${params.storeId}/categories`, data)
            }
            // console.log(res.data)
            toast.success(toastMessage)
            router.push(`/${params.storeId}/categories`)
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
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
            router.replace(`/${params.storeId}/categories`)
            toast.success("Category deleted")
            router.refresh();
        } catch (error) {
            toast.error('Make sure you delete all the products and categories using this Category')
        }
        finally {
            setLoading(false);
            setOpen(false);
        }
    }

    const origin = useOrigin();

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

                        <div className='grid sm:grid-cols-3 grid-cols-1 gap-8'>
                            <FormField
                                name='name'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Label</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} {...field} placeholder='Category name' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            >
                            </FormField>
                            <FormField
                                name='billboardId'
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Billboard</FormLabel>
                                        <Select
                                            disabled={loading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger >
                                                    <SelectValue defaultValue={field.value} placeholder="Select a billboard" />
                                                </SelectTrigger>
                                                </FormControl>
                                            <SelectContent>
                                                {
                                                    billboards && billboards.map((billboard) => (
                                                        <SelectItem value={billboard.id} key={billboard.id} >
                                                            {billboard.label}
                                                        </SelectItem>
                                                    ))
                                                }

                                            </SelectContent>
                                        </Select>


                                        <FormMessage />
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


export default CategoryFormPage;