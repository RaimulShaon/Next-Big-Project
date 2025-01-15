import {z} from 'zod';

export const acceptMessage = z.object({
    content: z.string().min(10).max(300)
})