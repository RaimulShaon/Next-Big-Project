import NextAuth from "next-auth";
declare module "next-auth"{
    interface Session {
        user: {
          _id?: string;
          address: string;
          isVerified: boolean;
          isacceptingMessages: boolean;
          username?: string
        } & DefaultSession["user"]
      }
    interface User {
        
          _id?: string;
          address: string;
          isVerified: boolean;
          isacceptingMessages: boolean;
          username?: string
      }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
      _id?: string;
      address: string;
      isVerified: boolean;
      isacceptingMessages: boolean;
      username?: string
    }
}