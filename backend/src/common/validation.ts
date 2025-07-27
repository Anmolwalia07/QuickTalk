import { z } from "zod";

export const registerInputValidation = (data: unknown) => {
  const Input = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    bio: z.string().optional(),
    image: z.string().url({ message: "Image must be a valid URL" }).optional()
  });
  return Input.safeParse(data);
};


export const loginInputValidation = (data: unknown) => {
  const Input = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  });
  return Input.safeParse(data);
};



export const addFriendInput = (data: unknown) => {
  const Input = z.object({
    friendId: z.string().min(12),
    request: z.string(),
  });
  return Input.safeParse(data);
};
