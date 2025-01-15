import { message } from "@/model/User.model";

export interface ApiResponse {
    success: boolean,
    message: string,
    isacceptingMessages ?: boolean,
    messages?: Array<message>
}