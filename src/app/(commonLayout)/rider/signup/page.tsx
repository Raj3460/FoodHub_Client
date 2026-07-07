// src/app/(commonLayout)/rider/signup/page.tsx

import { RiderSignupForm } from "@/components/modules/rider/authentication/rider-signup-form";


export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RiderSignupForm />
      </div>
    </div>
  );
}