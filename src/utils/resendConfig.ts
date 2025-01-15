import { resend } from "@/lib/resend";
import verification from "../../verificationEmail/verification";
import { ApiResponse } from "@/types/ApiResponse";


export async function resendConfig(email:string, username:string, verifiedCode: string):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'App Message Verification Code',
            react: verification({username, otp: verifiedCode})
          }); 
          return { success: true, message: 'Verification email sent successfully.' };
        } catch (emailError) {
          console.error('Error sending verification email:', emailError);
          return { success: false, message: 'Failed to send verification email.' };
        }
      }