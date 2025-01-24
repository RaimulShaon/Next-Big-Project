'use client'
import * as z from 'zod'
import {useForm} from 'react-hook-form';
import Link from "next/link";
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod'
import {useDebounceCallback} from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation';
import signUpSchema from '@/schemas/signUpSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';


function signUp() {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isChecking, setIsChecking] = useState(false)
    const [isSubmit, setIsSubmit] = useState(false)
    const debounced  = useDebounceCallback(setUsername, 500)    // bar bar username fielder validation thik ace kina ta check kore tar thake bachar jonno use kora hoy.
    const { toast } = useToast()
    const router = useRouter()

    //zod impleamentation
    const register =  useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            username: "",
            password: ""
        }
    })
    useEffect(()=>{
        const verifyUsername = async ()=>{
            if (username) {
                setIsChecking(true)
                setUsernameMessage("")  //reset UserName
                try {
                    const response = await axios.get<ApiResponse>(`/api/check_userName?username=${username}`)
                    console.log(response);
                    setUsernameMessage(response.data.message)
                    
                } catch (error) {
                   const errAxos= error as AxiosError<ApiResponse>
                   setUsernameMessage(errAxos.response?.data.message ?? "error Message")
                }  finally{
                    setIsChecking(false)
                }
            }
        };
        verifyUsername();
    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>)=>{
        setIsSubmit(true)
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data)
             console.log(response);
                toast({
                    title: 'Success',
                    description: response.data.message
                })
                router.replace(`/verify/${username}`)
                setIsSubmit(false)
        } catch (error) {
            console.error(error);
            const errAxos= error as AxiosError<ApiResponse>

            let errorMessage = errAxos.response?.data.message ?? "error Message: Sign-Up failed"

            toast({
                title: "Sign-Up failed",
                description: errorMessage,
                variant: "destructive"           
            })
            setIsSubmit(false)
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
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input type='text' placeholder="Username" {...field} onChange={event =>{field.onChange(event); debounced(event.target.value)}} />
                        {isChecking && <Loader2/>}
                        {!isChecking && usernameMessage && (<p className={`text-sm ${
                        usernameMessage === 'Username is unique'
                          ? 'text-green-500'
                          : 'text-red-500'
                        }`}
                         >
                      {usernameMessage}

                        </p>)}
                    </FormControl>
                    <FormDescription>This is your public display name.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={register.control}
                name= "email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input type='text' placeholder="Email" {...field} 
                         />
                      
                    </FormControl>
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input type='password' placeholder="Email" {...field} 
                         />
                      
                    </FormControl>
                    <FormDescription>This is your public display name.</FormDescription>
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
                'Sign Up'
              )}
                </Button>
                </form>
            </Form>
            </div>
            </div>
            
        </div>
    );
}

export default signUp;