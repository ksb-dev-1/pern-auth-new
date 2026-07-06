import z from "zod";

// Email schema
export const emailSchema = z.email({ message: "Please enter a valid email" });

// Password schema
export const passwordSchema = z
  .string()
  .min(1, { message: "Password is required" })
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/[^A-Za-z0-9]/, {
    message: "Password must contain at least one special character",
  });

// Confirm password schema
export const confirmPasswordSchema = z
  .string()
  .min(1, { message: "Please confirm password" });

// Sign-up schema
export const signUpSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: emailSchema,
    password: passwordSchema,
    passwordConfirmation: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

export type SignUpType = z.infer<typeof signUpSchema>;

// Sign-in schema
export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean().optional(),
});

export type SignInType = z.infer<typeof signInSchema>;

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;

// Reset password schema
export const resetPasswordSchema = z.object({
  newPassword: passwordSchema,
  passwordConfirmation: confirmPasswordSchema,
});

export type ResetPasswordType = z.infer<typeof resetPasswordSchema>;

// Url schema
export const urlSchema = z.string().refine(
  (val) => {
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  },
  { message: "Invalid URL" },
);

export type UrlType = z.infer<typeof urlSchema>;

// Project schema
export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  link: urlSchema,
});

export type ProjectType = z.infer<typeof projectSchema>;

// Social link schema
export const socialLinkSchema = z.object({
  platform: z.enum([
    "github",
    "linkedin",
    "twitter",
    "portfolio",
    "leetcode",
    "hackerrank",
  ]),
  url: urlSchema,
});

export type SocialLinkType = z.infer<typeof socialLinkSchema>;
