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
    name: z.string().min(1, "Owner name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Minimum length is 6"),
    confirmPassword: z.string().min(6, "Minimum length is 6"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function ProviderSignupForm({ ...props }: React.ComponentProps<typeof Card>) {
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
      const toastId = toast.loading("Creating restaurant account...");

      // 🔍 Before signing up, check if email already exists
      setIsChecking(true);
      const exists = await checkEmailExists(value.email);
      setIsChecking(false);

      if (exists) {
        toast.error(
          "This email is already registered. Please login...",
          { id: toastId, duration: 3000 }
        );
        // setTimeout(() => router.push("/provider/login"), 2000);
        return;
      }

      try {
        const result = await authClient.signUp.email({
          name: value.name,
          email: value.email,
          password: value.password,
          role: "PROVIDER",
        } as any);

        if (result?.error) {
          toast.error(result.error.message || "Registration failed", {
            id: toastId,
          });
          return;
        }

        toast.success("Account created! Please verify your email to continue.", {
          id: toastId,
        });
        router.push("/provider/login");
      } catch (error: any) {
        const msg = error?.message || "Something went wrong";
        if (
          msg.toLowerCase().includes("already") ||
          msg.toLowerCase().includes("exists")
        ) {
          toast.error("This email is already registered. Please login.", {
            id: toastId,
          });
          setTimeout(() => router.push("/provider/login"), 2000);
        } else {
          toast.error(msg, { id: toastId });
        }
      }
    },
  });

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>🏪 Become a Restaurant Partner</CardTitle>
        <CardDescription>
          Create your account first. After login, you can set up your restaurant
          profile from the dashboard.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="provider-signup-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            {/* Owner Name */}
            <form.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Owner Name</FieldLabel>
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
                      placeholder="restaurant@example.com"
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

          <p className="text-xs text-orange-600 mt-4 bg-orange-50 px-3 py-2 rounded-lg">
            ⚠️ After signing up, you&apos;ll need to add your restaurant details
            and wait for admin approval before you can start selling.
          </p>

          <CardFooter className="mt-4 px-0 flex-col gap-3">
            <Button
              form="provider-signup-form"
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={isChecking}
            >
              {isChecking ? "Checking..." : "Create Restaurant Account"}
            </Button>

            <p className="text-xs text-center text-gray-500">
              Already have a restaurant account?{" "}
              <a href="/provider/login" className="text-orange-500 hover:underline">
                Login here
              </a>
            </p>
            <p className="text-xs text-center text-gray-400">
              Want to order food instead?{" "}
              <a href="/signup" className="text-orange-500 hover:underline">
                Customer signup
              </a>
            </p>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}