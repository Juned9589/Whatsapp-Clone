import { email, z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name Must Be At Least 2 Characters"),
  email: z.string().email("Email must be valid"),
  password: z.string().min(6, "Password Must Be At Least 6 Characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Email Must Be Valid"),
  password: z.string().min(1, "Password is required"),
});
