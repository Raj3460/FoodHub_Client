// src/components/modules/rider/authentication/rider-login-form.tsx

"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { z } from "zod";
import { CustomUser } from "@/types/role.types";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export function RiderLoginForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Logging in...");
      try {
        const result = await authClient.signIn.email({
          email: value.email,
          password: value.password,
        });

        if (result.error) {
          toast.error(result.error.message || "Invalid credentials", {
            id: toastId,
          });
          return;
        }

        const user = result.data?.user as CustomUser;
        if (!user) {
          toast.error("Login failed. No user data received.", { id: toastId });
          return;
        }

        // ✅ Rider না হলে আটকাও
        if (user.role !== "RIDER") {
          toast.error(
            "This login is only for riders. Please use the correct login page.",
            { id: toastId }
          );
          await authClient.signOut();
          return;
        }

        toast.success("Welcome back, Rider! 🛵", { id: toastId });
        router.push("/rider/dashboard");
      } catch (error: any) {
        toast.error(error.message || "Something went wrong", { id: toastId });
      }
    },
  });

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>🛵 Rider Login</CardTitle>
        <CardDescription>
          Login to start accepting deliveries and earn money.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="rider-login-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
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
                      value={field.state.value}
                      placeholder="rider@example.com"
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
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
                      value={field.state.value}
                      placeholder="Enter your password"
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <Button
          form="rider-login-form"
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          Login
        </Button>

        <p className="text-sm text-center text-gray-500">
          New rider?{" "}
          <a href="/rider/signup" className="text-orange-500 hover:underline">
            Create an account
          </a>
        </p>
        <p className="text-xs text-center text-gray-400">
          Looking to order food?{" "}
          <a href="/login" className="text-orange-500 hover:underline">
            Customer login
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}