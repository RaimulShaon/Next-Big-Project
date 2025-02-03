import {getServerSession} from 'next-auth'
import { authoption } from '../auth/[...nextauth]/options'
import dbConnect from '@/lib/dbConfig' 
import UserModel from '@/model/User.model'
import { User } from 'next-auth'
import mongoose from 'mongoose'

export async function GET(request:Request) {
    await dbConnect()
    const session = await getServerSession(authoption)
    const user: User = session?.user
    if ( !session || !user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
          );
    }
    const userId = new mongoose.Types.ObjectId(user._id)
    try {
        const showMessage = await UserModel.aggregate([
            {$match: {_id: userId}},
            {$unwind: '$messages'},
            {$sort: {'messages.createdAt': -1}},
            {$group: {_id: '$_id', messages: {$push: '$messages'}}}
        ])
        if (!user || showMessage.length === 0) {
            return Response.json(
              { message: 'User not found', success: false },
              { status: 404 }
            );
          }
      
          return Response.json(
            { messages: showMessage[0].messages },
            {
              status: 200,
            }
          );
        } catch (error) {
          console.error('An unexpected error occurred:', error);
          return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
          );
        }
      }