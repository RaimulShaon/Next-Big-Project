'use client'
import * as z from 'zod'
import {useForm} from 'react-hook-form';
import Link from "next/link";
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {signIn} from 'next-auth/react'
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signInSchema } from '@/schemas/signInSchema';


function signInform() {
    
    const [isSubmit, setIsSubmit] = useState(false)
    
    const { toast } = useToast()
    const router = useRouter()

    //zod impleamentation
    const register =  useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: ""
        }
    })
   

    const onSubmit = async (data: z.infer<typeof signInSchema>)=>{
       const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password
       })
       if (result?.error) {
        if (result?.error== 'CredentialSignin') {
            toast({
                title: 'Login failed',
                description: "incorrect Username or Password",
                variant: "destructive"
            })
        }
       }
       if(result?.url){
        router.replace("/dashboard")
       }
    }

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-300'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
            <div className='text-center'>
            <Form {...register}>
                <form onSubmit ={register.handleSubmit(onSubmit)}>
            
            <FormField
                control={register.control}
                name= "identifier"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    
                        <Input type='text' placeholder="Email" {...field} 
                         />
                      
                    <FormDescription>This is your public display name.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={register.control}
                name= "password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                        <Input type='password' placeholder="Password" {...field} 
                         />
                      
                    <FormDescription>Enter Your Password. Don't share your password</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type='submit' disabled={isSubmit}>
                {isSubmit ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign In'
              )}
                </Button>
                </form>
            </Form>
            <div className="text-center mt-4">
                <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
                </Link>
                </p>
                </div>
            </div>
            </div>
            
        </div>
    );
}

export default signInform;