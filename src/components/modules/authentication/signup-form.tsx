"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Minimum length is 8"),
    confirmPassword: z.string().min(8, "Minimum length is 8"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);

  // Check if email exists in database
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/check-email?email=${encodeURIComponent(email)}`
      );
      const data = await res.json();
      return data.success && data.exists === true;
    } catch {
      return false;
    }
  };

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Creating account...");

      // 🔍 Before signing up, check if email already exists
      setIsChecking(true);
      const exists = await checkEmailExists(value.email);
      setIsChecking(false);

      if (exists) {
        toast.error(
          "This email is already registered. please login...",
          { id: toastId, duration: 3000 }
        );
        // setTimeout(() => router.push("/login"), 2000);
        return;
      }

      try {
        const result = await authClient.signUp.email({
          name: value.name,
          email: value.email,
          password: value.password,
          role: "CUSTOMER",
        } as any);

        if (result?.error) {
          toast.error(result.error.message || "Registration failed", {
            id: toastId,
          });
          return;
        }

        toast.success("Registration successful! Please verify your email.", {
          id: toastId,
        });
        router.push("/login");
      } catch (error: any) {
        const msg = error?.message || "Something went wrong";
        if (
          msg.toLowerCase().includes("already") ||
          msg.toLowerCase().includes("exists")
        ) {
          toast.error("This email is already registered. Please login.", {
            id: toastId,
          });
          setTimeout(() => router.push("/login"), 2000);
        } else {
          toast.error(msg, { id: toastId });
        }
      }
    },
  });

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="signup-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            {/* Name */}
            <form.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                    <Input
                      type="text"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      placeholder="Raj Kumar"
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isChecking}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            {/* Email */}
            <form.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      type="email"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      placeholder="you@example.com"
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isChecking}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            {/* Password */}
            <form.Field name="password">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      type="password"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      placeholder="Min. 8 characters"
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isChecking}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            {/* Confirm Password */}
            <form.Field name="confirmPassword">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                    <Input
                      type="password"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      placeholder="Re-enter password"
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isChecking}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>

          <CardFooter className="mt-4 px-0 flex-col gap-3">
            <Button
              form="signup-form"
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={isChecking}
            >
              {isChecking ? "Checking..." : "Create Account"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Already have an account?{" "}
              <a href="/login" className="text-orange-500 hover:underline">
                Login
              </a>
            </p>
            <p className="text-xs text-center text-muted-foreground">
              Want to sell food?{" "}
              <a
                href="/provider/signup"
                className="text-orange-500 hover:underline"
              >
                Register as Restaurant
              </a>{" "}
              or{" "}
              <a href="/become-rider" className="text-orange-500 hover:underline">
                Become a Rider
              </a>
            </p>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}