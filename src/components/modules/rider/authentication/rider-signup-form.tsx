// src/components/modules/authentication/rider-signup-form.tsx

"use client";

import { useState } from "react";
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

// ✅ Valid vehicle types — Backend এর সাথে Match করতে হবে
type VehicleType =
  | "bike"
  | "motorcycle"
  | "bicycle"
  | "car"
  | "auto"
  | "pickup"
  | "walk"
  | "others";

const VEHICLE_TYPES: { value: VehicleType; label: string }[] = [
  { value: "bike", label: "🏍️ Bike" },
  { value: "motorcycle", label: "🏍️ Motorcycle" },
  { value: "bicycle", label: "🚲 Bicycle" },
  { value: "car", label: "🚗 Car" },
  { value: "auto", label: "🛺 Auto" },
  { value: "pickup", label: "🚛 Pickup" },
  { value: "walk", label: "🚶 On Foot" },
  { value: "others", label: "🚗 Others" },
];

const VEHICLE_NEEDS_NUMBER: VehicleType[] = [
  "bike",
  "motorcycle",
  "car",
  "auto",
  "pickup",
];



  const formSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Minimum length is 8"),
    confirmPassword: z.string().min(8, "Minimum length is 8"),
    phone: z
      .string()
      .regex(/^01[3-9]\d{8}$/, "Valid Bangladeshi phone required (01XXXXXXXXX)"),
    vehicleType: z.enum([
      "bike", "motorcycle", "bicycle", "car", "auto", "pickup", "walk", "others",
    ]),
    vehicleNumber: z.string(),
    area: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (VEHICLE_NEEDS_NUMBER.includes(data.vehicleType as VehicleType)) {
        return !!data.vehicleNumber && data.vehicleNumber.trim().length > 0;
      }
      return true;
    },
    {
      message: "Vehicle number is required for this vehicle type",
      path: ["vehicleNumber"],
    }
  );

export function RiderSignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();

  // ✅ Error 2 Fix: form.useStore নেই, তাই React useState দিয়ে track করছি
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>("bike");
  const needsVehicleNumber = VEHICLE_NEEDS_NUMBER.includes(selectedVehicle);

  const form = useForm({
    // ✅ Error 1 Fix: vehicleType কে VehicleType type দিয়ে declare করা হলো
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      vehicleType: "bike" as VehicleType,
      vehicleNumber: "",
      area: "",
    },
    validators: {
      onSubmit: formSchema ,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Creating rider account...");
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/rider/signup`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              name: value.name,
              email: value.email,
              password: value.password,
              phone: value.phone,
              vehicleType: value.vehicleType,
              vehicleNumber: value.vehicleNumber || undefined,
              area: value.area || undefined,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Registration failed", { id: toastId });
          return;
        }

        toast.success(
          "Account created! Please check your email to verify your account.",
          { id: toastId }
        );
        router.push("/rider/login");
      } catch (error: any) {
        toast.error(error.message || "Something went wrong", { id: toastId });
      }
    },
  });

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>🛵 Become a Rider</CardTitle>
        <CardDescription>
          Join FoodGhor as a delivery partner and earn on your own schedule.
          Admin approval required after signup.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="rider-signup-form"
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
                      value={field.state.value}
                      placeholder="Rahim Uddin"
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

            {/* Phone */}
            <form.Field name="phone">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Phone Number</FieldLabel>
                    <Input
                      type="tel"
                      id={field.name}
                      value={field.state.value}
                      placeholder="01XXXXXXXXX"
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

            {/* Vehicle Type */}
            <form.Field name="vehicleType">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Vehicle Type</FieldLabel>
                  <select
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => {
                      const val = e.target.value as VehicleType;
                      field.handleChange(val);
                      // ✅ React state ও update করছি needsVehicleNumber এর জন্য
                      setSelectedVehicle(val);
                    }}
                    className="w-full border bg-primary-foreground border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                  >
                    {VEHICLE_TYPES.map((v) => (
                      <option key={v.value} value={v.value}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </Field>
              )}
            </form.Field>

            {/* Vehicle Number — শুধু দেখাবে যখন লাগবে */}
            {needsVehicleNumber && (
              <form.Field name="vehicleNumber">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Vehicle Number{" "}
                        <span className="text-orange-500">*</span>
                      </FieldLabel>
                      <Input
                        type="text"
                        id={field.name}
                        value={field.state.value}
                        placeholder="DHAKA-METRO-GA-1234"
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
            )}

            {/* Area */}
            <form.Field name="area">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Working Area{" "}
                    <span className="text-gray-400 text-xs">(optional)</span>
                  </FieldLabel>
                  <Input
                    type="text"
                    id={field.name}
                    value={field.state.value}
                    placeholder="e.g. Mirpur, Dhaka"
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </Field>
              )}
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
                      placeholder="Min. 8 characters"
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

            {/* Confirm Password */}
            <form.Field name="confirmPassword">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Confirm Password
                    </FieldLabel>
                    <Input
                      type="password"
                      id={field.name}
                      value={field.state.value}
                      placeholder="Re-enter password"
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

          <p className="text-xs text-orange-600 mt-4 bg-orange-50 px-3 py-2 rounded-lg">
            ⚠️ After signing up, admin approval is required before you can
            start accepting deliveries.
          </p>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <Button
          form="rider-signup-form"
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          Create Rider Account
        </Button>
        <p className="text-xs text-center text-gray-500">
          Already have a rider account?{" "}
          <a href="/rider/login" className="text-orange-500 hover:underline">
            Login here
          </a>
        </p>
        <p className="text-xs text-center text-gray-400">
          Want to order food?{" "}
          <a href="/signup" className="text-orange-500 hover:underline">
            Customer signup
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}