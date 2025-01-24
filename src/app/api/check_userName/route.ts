import dbConnect from "@/lib/dbConfig";
import UserModel from "@/model/User.model";
import {z} from 'zod'
import { usernameValidation } from "@/schemas/signUpSchema";

const usernamequry = z.object({username: usernameValidation })

export async function GET(request: Request){
    await dbConnect()

    try {
        const {searchParams} =  new URL(request.url)
        const queryparams = {username: searchParams.get('username')}
        const result = usernamequry.safeParse(queryparams)
        console.log(result);
        

        if (!result.success) {
            const usernameError = result.error.format().username?._errors || []
            return Response.json(
                {
                    success: false,
                    message: usernameError?.length>0? usernameError.join(','): "userName already taken"
                }, {status: 400})
        }
        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({
          username,
          isVerified: true,
        });
    
        if (existingVerifiedUser) {
          return Response.json(
            {
              success: false,
              message: 'Username is already taken',
            },
            { status: 200 }
          );
        }
    
        return Response.json(
          {
            success: true,
            message: 'Username is unique',
          },
          { status: 200 }
        );

    } catch (error) {
        console.error("username already Exist", error)
        return Response.json(
            {success: false, message:'username already Exist'},{status:500})
    }
}