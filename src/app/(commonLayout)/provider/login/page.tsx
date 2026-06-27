// src/app/(commonLayout)/provider/login/page.tsx

import { ProviderLoginForm } from "@/components/modules/provider/authentication/provider-login-form";


export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">

    
      <div className="w-full max-w-sm">
        <ProviderLoginForm />
      </div>
     
    </div>
  );
}