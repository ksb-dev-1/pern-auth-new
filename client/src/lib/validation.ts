import z from "zod";

// ----- Email schema -----
export const emailSchema = z.email({ message: "Please enter a valid email" });

// ----- Password schema -----
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special character");

// ----- Confirm password schema -----
export const confirmPasswordSchema = z
  .string()
  .min(1, { message: "Please confirm password" });

// ----- Sign-up schema -----
export const signUpSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpType = z.infer<typeof signUpSchema>;

// ----- Sign-in schema -----
export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean().optional(),
});

export type SignInType = z.infer<typeof signInSchema>;

// ----- Forgot password schema -----
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;

// ----- Reset password schema -----
export const resetPasswordSchema = z.object({
  newPassword: passwordSchema,
  confirmPassword: confirmPasswordSchema,
});

export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;
