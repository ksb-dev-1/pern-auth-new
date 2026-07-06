"use client";

import { type ChangeEvent, useState } from "react";

import { Eye, EyeOff } from "lucide-react";
import {
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { CustomLink } from "../custom-link";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

type PasswordFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldState: ControllerFieldState;
  label?: string;
  showForgotPassword?: boolean;
  placeholder?: string;
  autoComplete?: string;
};

export function PasswordField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  field,
  fieldState,
  label = "Password",
  showForgotPassword = false,
  placeholder,
  autoComplete = "current-password",
}: PasswordFieldProps<TFieldValues, TName>) {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    field.onChange(e);

    if (!e.target.value) {
      setShowPassword(false);
    }
  };

  return (
    <Field data-invalid={fieldState.invalid}>
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

        {showForgotPassword && (
          <CustomLink
            href="/forgot-password"
            className="text-brand hover:underline"
          >
            Forgot your password?
          </CustomLink>
        )}
      </div>

      <div className="relative">
        <Input
          {...field}
          id={field.name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={fieldState.invalid}
          onChange={handleChange}
          className="pr-10"
        />

        {field.value && (
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
