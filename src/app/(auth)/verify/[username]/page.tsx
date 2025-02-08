'use client'
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast"
import { verificationSchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from "react-hook-form";
import * as z from 'zod'

function Verify() {
    const router = useRouter()
    const params = useParams()
    const {toast} = useToast();
    //zod implementation
    const register = useForm<z.infer<typeof verificationSchema>>({resolver:zodResolver(verificationSchema)})

    const onSubmit = async (data: z.infer<typeof verificationSchema>) =>{
        try {
            const response = await axios.post<ApiResponse>('/api/verify',{
                username: params.username,
                code: data.code
            })
            toast({
                title: "success",
                description: response.data.message
            })
            router.replace('/sign-in')
            
        } catch (error) {
            console.error(error);
            const errAxos= error as AxiosError<ApiResponse>

            let errorMessage = errAxos.response?.data.message ?? "error Message: Sign-Up failed"

            toast({
                title: "Verification failed",
                description: errorMessage,
                variant: "destructive"           
            })
        }
    }
    
     
    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-300'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
            <div className='text-center'>
            <Form {...register}>
                <form onSubmit={register.handleSubmit(onSubmit)}>
                <FormField
                    control={register.control}
                    name= "code"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          
                            <Input placeholder="Verification code" {...field}  />
                       
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button className="w-full my-4" type="submit">Verify</Button>
                </form>
                </Form>
            </div>
            </div>
            
        </div>
    );
}

export default Verify;