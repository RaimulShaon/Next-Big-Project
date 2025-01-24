import dbConnect from "@/lib/dbConfig";
import UserModel from "@/model/User.model";
import { message as mesge } from "@/model/User.model";



export async function POST(request:Request) {
    await dbConnect()
    const {username, message} = await request.json()
    try {
        const user = await UserModel.findOne(username)
        if (!user) {
            return Response.json({success: false, message: "user Not Found"}, {status:404})
        }
        // Check if the user is accepting messages
        if (!user.isacceptingMessages) {
            return Response.json(
              { message: 'User is not accepting messages', success: false },
              { status: 403 } // 403 Forbidden status
            );
        }
        const newmessage = {content:"", createdAt: new Date()}
        user.messages.push(newmessage as mesge )
        await user.save()
        
        return Response.json(
            { message: 'Message sent successfully', success: true },
            { status: 201 }
          );
        } catch (error) {
          console.error('Error adding message:', error);
          return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
          );
        }
      }