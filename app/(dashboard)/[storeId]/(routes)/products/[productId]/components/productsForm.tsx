'use client'
import { Categories, Color, Image, Product, Size } from '@prisma/client'
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
import { SelectItem, SelectTrigger, Select, SelectContent, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import UploadImage from '@/components/upload-image'



interface ProductFormProps {
    initialData: Product & { price: number } & {
        images: Image[]
    } | null;
    size: Size[];
    category: Categories[];
    color: Color[]
}

const ProductSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().optional(),
    price: z.coerce.number().min(1, { message: "Price is required" }),
    images: z.object({ imageUrl: z.string() }).array().min(1, { message: "Image is required" }),
    sizeId: z.string().min(1, { message: "Size is required" }),
    categoryId: z.string().min(1, { message: "Category is required" }),
    colorId: z.string().min(1, { message: "Color is required" }),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
    quantity: z.coerce.number().min(0)
});
type ProductFormZ = z.infer<typeof ProductSchema>;


export const ProductFormPage: React.FC<ProductFormProps> = ({
    initialData, category, size, color
}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const router = useRouter();

    const title = initialData ? "Edit Product" : "Create Product";
    const description = initialData ? "Edit a Product" : "Add a new Product";
    const toastMessage = initialData ? "Product updated" : "Product updated";
    const action = initialData ? "Save changes" : "Create Product";
    const initialImageArray: { imageUrl: string }[] = [];
    const form = useForm<ProductFormZ>({
        resolver: zodResolver(ProductSchema),
        defaultValues: initialData ? {
            ...initialData,
            description: initialData.description!,
            quantity: Number(initialData.quantity)
        } : {
            name: "",
            images: initialImageArray,
            categoryId: "",
            colorId: "",
            sizeId: "",
            isFeatured: false,
            isArchived: false,
            price: 0,
            quantity: 1,
            description: ""
        }
    })

    const onSubmit = async (data: ProductFormZ) => {
        setLoading(true);
        console.log(data);
        // return
        try {
            var res;
            if (initialData) {
                res = await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data)
            }
            else {
                res = await axios.post(`/api/${params.storeId}/products`, data)
            }
            // console.log(res.data)
            toast.success(toastMessage)
            router.push(`/${params.storeId}/products`)
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
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            toast.success('products deleted')
            router.replace(`/${params.storeId}/products`)
            router.refresh();
        } catch (error) {
            toast.error('Something went wrong')
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
                <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-4 sm:space-y-8' >
                    <FormField
                        control={form.control}
                        name='images'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product image</FormLabel>
                                <FormControl>
                                    <UploadImage
                                    allowMultiple={true}
                                        value={field.value.map((image) => image.imageUrl)}
                                        disabled={loading}
                                        onChange={(imageUrls) => {
                                            const current = form.getValues('images') ?? [];
                                            const currentUrls = current.map((img) => img.imageUrl);

                                            const isReorder =
                                                imageUrls.length === currentUrls.length &&
                                                imageUrls.every((url) => currentUrls.includes(url));

                                            if (isReorder) {
                                                // pure reorder — REPLACE, don't append
                                                const reordered = imageUrls.map((url) => ({ imageUrl: url }));
                                                form.setValue('images', reordered, {
                                                    shouldValidate: true,
                                                    shouldDirty: true,
                                                });
                                            } else {
                                                // genuine new upload — append only the truly new ones
                                                const newUrls = imageUrls.filter((url) => !currentUrls.includes(url));
                                                const newImages = newUrls.map((imageUrl) => ({ imageUrl }));
                                                form.setValue('images', [...current, ...newImages], {
                                                    shouldValidate: true,
                                                    shouldDirty: true,
                                                });
                                            }
                                        }}
                                        onRemove={(url) => {
                                            const current = form.getValues('images') ?? [];
                                            form.setValue(
                                                'images',
                                                current.filter((image) => image.imageUrl !== url),
                                                { shouldValidate: true, shouldDirty: true }
                                            );
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-8'>
                        <FormField
                            disabled={loading}
                            name='name'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name <span className='text-rose-500'>*</span></FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} {...field} placeholder='Product name' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            disabled={loading}
                            name='description'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} {...field} placeholder='Product description' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            disabled={loading}

                            name='price'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price <span className='text-rose-500'>*</span></FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            min={0}
                                            disabled={loading}
                                            {...field}
                                            onKeyDown={(event) => {
                                                if (event.key === '-') event.preventDefault();
                                            }}
                                            placeholder='Price'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        >
                        </FormField>


                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-8' >
                        <FormField
                            disabled={loading}

                            name='sizeId'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Size <span className='text-rose-500'>*</span></FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger >
                                                <SelectValue placeholder="Size" defaultValue={field.value} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <FormMessage />

                                        <SelectContent>
                                            {size && size.map((size) => (
                                                <SelectItem key={size.id} value={size.id} >
                                                    {size.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        >
                        </FormField>
                        <FormField
                            disabled={loading}

                            name='colorId'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color <span className='text-rose-500'>*</span></FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger >
                                                <SelectValue placeholder="Color" defaultValue={field.value} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {color && color.map((color) => (
                                                <SelectItem key={color.id} value={color.id} >
                                                    <div className='flex w-full space-x-3 justify-between  items-center' >
                                                        <div>{color.name}</div>
                                                        <div style={{ backgroundColor: color.value }} className='rounded-full h-4 w-4' ></div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>

                                    </Select>
                                    <FormMessage />

                                </FormItem>
                            )}
                        />
                        <FormField
                            disabled={loading}
                            name='categoryId'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category <span className='text-rose-500'>*</span></FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger >
                                                <SelectValue placeholder="Category" defaultValue={field.value} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <FormMessage />

                                        <SelectContent>
                                            {category && category.map((category) => (
                                                <SelectItem key={category.id} value={category.id} >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />





                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-8'>
                        <FormField
                            disabled={loading}
                            name='quantity'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Qunatity</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            min={0}
                                            disabled={loading}
                                            {...field}
                                            onKeyDown={(event) => {
                                                if (event.key === '-') event.preventDefault();
                                            }}
                                            placeholder='Stock Quantity'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            disabled={loading}

                            name='isFeatured'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className='flex items-start space-x-3 p-4 border rounded-md'>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className='mt-2' // Adjust height and width if needed
                                        />
                                    </FormControl>

                                    <div className='flex flex-col space-y-1 leading-none'>
                                        <FormLabel>Featured</FormLabel>
                                        <FormDescription className='text-sm text-slate-700'>
                                            This product will appear on the home page
                                        </FormDescription>
                                    </div>

                                </FormItem>

                            )}
                        >
                        </FormField>
                        <FormField
                            disabled={loading}

                            name='isArchived'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className='flex items-start space-x-3 p-4 border rounded-md'>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className='mt-2' // Adjust height and width if needed
                                        />
                                    </FormControl>
                                    <div className='flex flex-col space-y-1 leading-none'>
                                        <FormLabel>Archived</FormLabel>
                                        <FormDescription className='text-sm text-slate-700'>
                                            This product will not appear anywhere in the store
                                        </FormDescription>
                                    </div>

                                </FormItem>
                            )}
                        >
                        </FormField>
                    </div>
                    <Button disabled={loading} type='submit' className='mt-4'  >{action}</Button>
                </form>
            </Form >
            <Separator />

        </>
    )
}


export default ProductFormPage;