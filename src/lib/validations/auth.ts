import * as z from "zod";

export const authSchema = z.object({
  identifier: z.string().refine(
    (value) => {
      const isEmail = value.includes("@") && value.includes(".");
      const isUsername = value.length >= 6;

      return isEmail || isUsername;
    },
    {
      message: "Please enter a valid identifier",
    },
  ),
  password: z
    .string()
    .min(5, {
      message: "Password must be at least 5 characters long",
    })
    .max(100),
});

export const signUpSchema = z
  .object({
    identifier: z.string().email({
      message: "Please enter a valid email address",
    }),
    password: z
      .string()
      .min(5, {
        message: "Password must be at least 5 characters long",
      })
      .max(100),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
