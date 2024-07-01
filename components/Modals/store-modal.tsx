'use client'
import { Modal } from "@/app/Modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from 'axios';

import * as  z from "zod";
import { FormItem, Form, FormControl, FormField, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import toast from "react-hot-toast";

const formSchema = z.object({
    name: z.string().min(1),
})

export const StoreModal = () => {
    const [isLoading, setIsLoading] = useState(false);

    const StoreModal = useStoreModal();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    })
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);
            console.log(values)
            const response = await axios.post('/api/stores', values);
            console.log(response.data)
            // toast.success("Store created")
            window.location.assign(`/${response.data.id}`)
        } catch (error) {
            toast.error("Some error occured")
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <Modal
            title="Create store"
            description="Add a new store to manage product and category"
            isOpen={StoreModal.isOpen} onClose={StoreModal.onClose}
        >
            <div className="space-y-2 py-2 pb-4">
                <Form {...form}> {/* to spread and access all fields of form in this Form  */} 
                    <form onSubmit={form.handleSubmit(onSubmit)} >
                        <FormField
                        disabled={isLoading}
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
                            <Button disabled={isLoading} type="button" variant={'outline'} onClick={StoreModal.onClose} >Cancel</Button>
                            <Button disabled={isLoading} type="submit" >Continue</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </Modal>
    )
}