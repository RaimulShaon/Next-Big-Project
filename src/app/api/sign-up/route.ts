import dbConnect from "@/lib/dbConfig";
import UserModel from "@/model/User.model";
import bcrypt from 'bcrypt';
import { resendConfig } from "@/utils/resendConfig";

export async function POST(request:Request) {
    await dbConnect();

    try {
        const {username, email, password}= await request.json()
        const user = await UserModel.findOne({username, isVerified: true})
        if (user) {
            return Response.json({success: false, message: 'Username is already taken'},{status:400})
        }
        let userByEmail = await UserModel.findOne({email})
        let verifiedCode = Math.floor(100000 + Math.random()*900000).toString()

        if (userByEmail) {
            if (userByEmail?.isVerified) {
                return Response.json({success: false, message: "user already Exist"},{status:400})
            }
            else {
            const hasedPassword = await bcrypt.hash(password, 10);
            userByEmail.password = hasedPassword;
            userByEmail.verifiedCode = verifiedCode;
            userByEmail.verifiedCondeExpires = new Date(Date.now()+300000);
            await userByEmail.save()
            } 
        } else{
            const hasedPassword = await bcrypt.hash(password, 10);
            const expirydate = new Date()
            expirydate.setHours(expirydate.getHours()+1)
            
            const newUser = new UserModel({
                username,
                email,
                password: hasedPassword,
                verifiedCode,
                verifiedCondeExpires: expirydate,
                isVerified: false,
                isacceptingMessages: true,
                messages:[]
            })
            await newUser.save()
        }
        const sendMail = await resendConfig(email, username, verifiedCode);
        if (!sendMail.success) {
            return Response.json(
              {
                success: false,
                message: sendMail.message,
              },
              { status: 500 }
            );
          }


        return Response.json({
            success: true,
            message: "User Register Successfully"   
        }, {status: 200})
    } catch (error) {
        console.error("Error Registering user",error);
        return Response.json({
            success: false,
            message: "Error Registering user"   
        }, {status: 500})
        
    }
}
