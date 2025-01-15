import {z} from 'zod';

export const verificationSchema = z.object({
    code: z.string().length(6, "verification Code must be 6 carater")
})
