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
    const [username, setUsername] = useState('')    //username validation check useing deouncing tech
    const [usernameMessage, setUsernameMessage] = useState('')      //backend mesg username available or not
    const [isChecking, setIsChecking] = useState(false)
    const [isSubmit, setIsSubmit] = useState(false)     //form submit state
    const debounced  = useDebounceCallback(setUsername, 300)    // bar bar username fielder validation thik ace kina ta check kore tar thake bachar jonno use kora hoy.
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
                setUsernameMessage("")  //reset UserName messages
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
            <div className="text-center">
             <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                 Join True Feedback Apps
                </h1>
                <p className="mb-4">Sign up to start your anonymous adventure</p>
                </div>
            <Form {...register}>
                <>
                <form onSubmit ={register.handleSubmit(onSubmit)}>
            <FormField
                control={register.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className='text-lg'>Username</FormLabel>
                    
                        <Input type='text' placeholder="Write your Username" {...field} value={username} onChange={event =>{field.onChange(event); debounced(event.target.value)}} />
                        {isChecking && <Loader2/>}
                        {!isChecking && usernameMessage && (<p className={`text-sm ${
                        usernameMessage === 'Username available'
                          ? 'text-green-500'
                          : 'text-red-500'
                        }`}
                         >
                      {usernameMessage}

                        </p>)}
                    
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={register.control}
                name= "email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel  className='text-lg'>Email</FormLabel>
                  
                        <Input type='text' placeholder="Enter your Email" {...field} 
                         />
                      
                    
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={register.control}
                name= "password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel  className='text-lg font-bold'>Password</FormLabel>
                  
                        <Input type='password' placeholder="Enter your Password" {...field} 
                         />
                      
               
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button className="w-full my-4" type='submit' disabled={isSubmit}>
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
                </>
            </Form>
            </div>
            </div>
            
        </div>
    );
}

export default signUp;