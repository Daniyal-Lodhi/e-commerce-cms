'use client'
import { Modal } from "@/app/Modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import * as  z from "zod";
import { FormItem, Form, FormControl, FormField, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const formSchema = z.object({
    name: z.string().min(1),
})

export const StoreModal = () => {
    const StoreModal = useStoreModal();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    })
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
    }
    return (
        <Modal
            title="Create store"
            description="Add a new store to manage product and category"
            isOpen={StoreModal.isOpen} onClose={StoreModal.onClose}
        >
            <div className="space-y-2 py-2 pb-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} >
                        <FormField
                            control={form.control}
                            name="name" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel >Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="E-commerce" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="pt-6 flex justify-end items-center space-x-2" >
                            <Button type="button" variant={'outline'} onClick={StoreModal.onClose} >Cancel</Button>
                            <Button type="submit" >Continue</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </Modal>
    )
}