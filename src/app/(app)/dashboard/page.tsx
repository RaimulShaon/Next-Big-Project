'use client'

import { MessageCard } from "@/components/messageCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { message } from "@/model/User.model";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from 'zod'

function dashboard() {
    const [message, setMessage] = useState<message[]>([])   //joto msg ace sob ai mssg er moddhe dhuke jabe
    const [loading, setLoading ] = useState(false)  //msg fetch korar jonno 
    const [isSwitchLoading, setIsSwitchLoading ] = useState(false)  //button er state chng korar jonno
    const {toast} = useToast()
    const messageDelHandeler = (messageId: string)=>{
        setMessage(message.filter((item)=>messageId !== item._id))
    }
    const {data: session} = useSession()
    //zod implementation
    const form = useForm<z.infer<typeof acceptMessageSchema>>({resolver: zodResolver(acceptMessageSchema)})
    const {register, watch, setValue } = form;
    
    const acceptMessage = watch('acceptMessage')

    const fetchAcceptMessages = useCallback(async()=>{
        setIsSwitchLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages');
            const isAcceptingMessages = response.data.isacceptingMessages ?? false; // Provide a default value
        setValue("acceptMessage", isAcceptingMessages);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data.message?? 'Error get data in accept messages',
                variant: "destructive"
            })
            
        } finally{
            setIsSwitchLoading(false)
        }
    }, [setValue, toast])

    const fetchGetMessage = useCallback(async(refresh: boolean =false)=>{
        setLoading(true)
        setIsSwitchLoading(true)
        try {
            const res = await axios.get('api/get-messages')
            if (refresh) {
                setMessage(res.data.message)
                toast({
                    title: "Refreshed Message",
                    description: "Showing latest massegges.."
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data.message?? 'Error get data in accept messages',
                variant: "destructive"
            })
            
        } finally{
            setIsSwitchLoading(false)
            setLoading(false)
        }
    },[setLoading, setMessage, toast])

    useEffect(()=>{
        if (!session || !session.user) return;
        fetchGetMessage();
        fetchAcceptMessages()

    }, [setValue, session, fetchAcceptMessages, fetchGetMessage])

    const handleSwitch = async()=>{
        try {
            const response = await axios.post('/api/accept-message', {acceptMessage: !acceptMessage})
            setValue('acceptMessage', !acceptMessage)
            toast({
                title: response.data.message,
                variant:'default'
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data.message?? 'Error get data in accept messages',
                variant: "destructive"
            })
        }
    }
    if (!session || !session.user) {
        <div>Please LogIn</div>
    }
    const {username} = session?.user as User

    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`
    const copytoClipboard = ()=> {navigator.clipboard.writeText(profileUrl)
        toast({title: 'url Copied',
            description: "Url copied to the clipBoard"
        })
    }
    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copytoClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessage')}
          checked={acceptMessage}
          onCheckedChange={handleSwitch}
          disabled={loading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessage ? 'On' : 'Off'}
        </span>
      </div>
      

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchGetMessage(true);
        }}
      >
        {isSwitchLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {message.length > 0 ? (
          message.map((item, index) => (
            <MessageCard
              key={item._id}
              message={item}
              onMessageDelete={messageDelHandeler}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
    );
}

export default dashboard;