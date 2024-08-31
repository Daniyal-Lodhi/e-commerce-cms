'use client'
import { Store } from '@prisma/client'
import { Heading } from '@/components/heading'
import { Button } from '@/components/ui/button'
import { FormInput, Trash } from 'lucide-react'
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



interface SettingsFormProps {
    initialData: Store
}
const SettingsFormSchema = z.object({
    name: z.string().min(1),
    frontendUrl:z.string().min(1),
})
type SettingsFormZ = z.infer<typeof SettingsFormSchema>;


export const SettingsFormPage: React.FC<SettingsFormProps> = ({
    initialData
}) => {
    // console.log(initialData)
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const form = useForm<SettingsFormZ>({
        resolver: zodResolver(SettingsFormSchema),
        defaultValues: {
            name:initialData.name,
            frontendUrl: initialData?.frontendUrl || ""
        }
    })

    const onSubmit = async (data: SettingsFormZ) => {

        setLoading(true);

        try {
            await axios.patch(`/api/stores/${params.storeId}`, data)
            router.refresh(); // syncs changes in the router by refreshing it, as in this case synced the name of store after update.
            toast.success('Store updated successfully')
        } catch (error) {
            toast.error("Something went wrong.")
            console.log(error)
        }
        finally {
            setLoading(false);
        }
    }
    const onConfirm = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/stores/${params.storeId}`);
            router.refresh();
            router.push('/')
            toast.success('Store deleted successfully')
        } catch (error) {
            toast.error('Something went wrong')
        }
        finally {
            setLoading(false);
            setOpen(false);
        }
    }

    const origin = useOrigin() ;

    return (
        <> 

            <AlertModal  loading={loading} isOpen={open} onClose={() => setOpen(false)} onConfirm={onConfirm} />
            <div className='flex items-center justify-between' >
                <Heading title={"Settings"} description={"Manage store preferences"} />
                <Button
                    disabled={loading}
                    variant={"destructive"}
                    size={'icon'}
                    onClick={() => setOpen(true)}
                >
                    <Trash className='h-4 w-4' />
                </Button>
            </div>
            <Separator />
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} >
                    <div className='grid grid-cols-3 gap-8' >
                        <FormField
                            name='name'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} {...field} placeholder='Store name' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            name='frontendUrl'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Frontend Url</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} {...field} placeholder='Frontend url' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        

                    </div>
                    <Button disabled={loading} type='submit' className='mt-4'  >Save Changes</Button>
                </form>
            </Form >
            <Separator />
            <ApiAlert 
            title='NEXT_PUBLIC_API_URL' 
            description={`${origin}/api/${params.storeId}`} 
            variant='public' />
        </>
    )
}


export default SettingsFormPage;