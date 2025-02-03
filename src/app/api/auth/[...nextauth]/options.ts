import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConfig";
import UserModel from "@/model/User.model";
import bcrypt from "bcrypt"

export const authoption: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id: 'Credentials',
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials:any):Promise<any>    {
                await dbConnect()

                try {
                    const user = await UserModel.findOne({
                        $or:[
                            { email: credentials?.identifier.email},
                            { username: credentials?.identifier},
                        ]
                    }); 
                    if (!user) {
                        throw new Error("No User Found with this email")
                    }
                    if (!user.isVerified) {
                        throw new Error("Please verify your email")
                    }
                    const isPasswordCorrect = await bcrypt.compare( credentials?.password, user.password,);
                    if (!isPasswordCorrect) {
                        throw new Error("Password is not correct")
                    }else{
                        return user
                    }
                } catch (error) {
                    throw new Error(`authorization ERROR: ${error}`)
                }
            },
        }),
    ],
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isacceptingMessages = user.isacceptingMessages;
                token.username = user.username;
            }
            return token
        },
        async session({ session, token }) {
            // Send properties to the client, like an access_token and user id from a provider.
            if (token) {
                session.user.isVerified = token.isVerified;
                session.user.id = token.id;
                session.user.isacceptingMessages = token.isacceptingMessages;
                session.user.username = token.username
                
            }
            
            return session
          },
        },
        session:{
            strategy: 'jwt'
        },
        secret: process.env.NEXTAUTH_SECRET,
        pages:{
            signIn: '/sign-in'
        }
    }    

 
