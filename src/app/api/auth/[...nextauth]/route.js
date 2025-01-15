import NextAuth from "next-auth";
import {authoption} from './options'

const authHandaler=NextAuth(authoption)
export {authHandaler as GET, authHandaler as POST}