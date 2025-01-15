import { z } from 'zod';

export const usernameValidation = z.string().min(2).max(30)

const signUpSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default signUpSchema;