import dbConnect from "@/lib/dbConfig";
import UserModel from "@/model/User.model";
import { getServerSession } from "next-auth";
import { authoption } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { message } from "@/model/User.model";

export async function DELETE(request:Request, {params}: {params: {messageId: string}}) {
    const messageId = params.messageId
    await dbConnect()
    const session =  await getServerSession(authoption)
    const user = session?.user
    if (!session || !user) {
        return Response.json(
            {success: false, message: "user Not Authinticated"},
            {status: 500}
        )
    }
    try {
        const updateMessage = await UserModel.findOne(
            {_id: user._id},
            {$pull:{messages: {_id: messageId}}}
        )
        if (!updateMessage?.isModified('messages')) {
            return Response.json(
              { message: 'Message not found or already deleted', success: false },
              { status: 404 }
            );
          }
      
          return Response.json(
            { message: 'Message deleted', success: true },
            { status: 200 }
          );
        } catch (error) {
          console.error('Error deleting message:', error);
          return Response.json(
            { message: 'Error deleting message', success: false },
            { status: 500 }
          );
        }
      }