// src/app/(commonLayout)/rider/login/page.tsx

import { RiderLoginForm } from "@/components/modules/rider/authentication/rider-login-form";


export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RiderLoginForm />
      </div>
    </div>
  );
}