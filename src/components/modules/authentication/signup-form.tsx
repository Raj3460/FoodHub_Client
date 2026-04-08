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
import { useRouter } from "next/navigation";   // ✅ Next.js router
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Minimum length is 6"),
    confirmPassword: z.string().min(6, "Minimum length is 6"),
    role: z.enum(["CUSTOMER", "PROVIDER"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();   // ✅ Next.js router

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "CUSTOMER",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Creating account...");
      try {
        const result = await authClient.signUp.email({
          name: value.name,
          email: value.email,
          password: value.password,
          role: value.role,   // top‑level property
        } as any);

        if (result.error) {
          toast.error(result.error.message || "Registration failed", { id: toastId });
          return;
        }

        toast.success("Registration successful! Please verify your email.", { id: toastId });
        router.push("/login");   // ✅ Next.js navigation
      } catch (error: any) {
        toast.error(error.message || "Something went wrong", { id: toastId });
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
                      placeholder="Min. 6 characters"
                      onChange={(e) => field.handleChange(e.target.value)}
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
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            {/* Role Selector */}
            <form.Field name="role">
              {(field) => (
                <Field>
                  <FieldLabel>I want to join as:</FieldLabel>
                  <div className="flex flex-col gap-2 mt-1">
                    {/* Customer */}
                    <label
                      className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition ${
                        field.state.value === "CUSTOMER"
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="CUSTOMER"
                        checked={field.state.value === "CUSTOMER"}
                        onChange={() => field.handleChange("CUSTOMER")}
                        className="accent-orange-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">🙋 Customer</p>
                        <p className="text-xs text-gray-500">Browse and order meals</p>
                      </div>
                    </label>

                    {/* Provider */}
                    <label
                      className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition ${
                        field.state.value === "PROVIDER"
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="PROVIDER"
                        checked={field.state.value === "PROVIDER"}
                        onChange={() => field.handleChange("PROVIDER")}
                        className="accent-orange-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">🏪 Restaurant</p>
                        <p className="text-xs text-gray-500">Sell your meals on FoodHub</p>
                      </div>
                    </label>
                  </div>

                  {/* Provider warning */}
                  {field.state.value === "PROVIDER" && (
                    <p className="text-xs text-orange-500 mt-2 bg-orange-50 px-3 py-2 rounded-lg">
                      ⚠️ Restaurant account needs admin approval before you can start selling.
                    </p>
                  )}
                </Field>
              )}
            </form.Field>
          </FieldGroup>

          <CardFooter className="mt-4 px-0">
            <form.Subscribe selector={(state) => state.values.role}>
              {(role) => (
                <Button
                  form="signup-form"
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  Register as {role === "CUSTOMER" ? "Customer" : "Restaurant"}
                </Button>
              )}
            </form.Subscribe>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}