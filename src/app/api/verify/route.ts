import dbConnect from "@/lib/dbConfig";
import UserModel from "@/model/User.model"; 

export async function POST(request:Request) {
    await dbConnect()
    try {
        const {username, code}= await request.json()
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({
            username: decodedUsername
        })
        if (!user) {
            return Response.json(
                {success: false, message:'User not Found'},{status:400})

        }
        const userCodeValid = user.verifiedCode === code
        const CodeExpires = new Date(user.verifiedCondeExpires) >  new Date()
        if (userCodeValid && CodeExpires) {
           user.isVerified = true
           await user.save()
            return Response.json(
                {success: true, message:'userCode verified '},{status:200})
        }else if (!CodeExpires) {
            // Code has expired
            return Response.json(
              {
                success: false,
                message:
                  'Verification code has expired. Please sign up again to get a new code.',
              },
              { status: 400 }
            );
          } else {
            // Code is incorrect
            return Response.json(
              { success: false, message: 'Incorrect verification code' },
              { status: 400 }
            );
          }
    } catch (error) {
        console.error("Error verify userCode", error)
        return Response.json(
            {success: false, message:'Error verify userCode'},{status:500})
    }
}