// src/app/(commonLayout)/provider/become-a-partner/signup/page.tsx

import { ProviderSignupForm } from "@/components/modules/authentication/provider-signup-form";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ProviderSignupForm />
      </div>
    </div>
  );
}