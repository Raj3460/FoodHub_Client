// src/app/(commonLayout)/provider/signup/page.tsx

import { ProviderSignupForm } from "@/components/modules/provider/authentication/provider-signup-form";
import { StepsToActivation } from "@/components/modules/provider/signup_page/provider-activation-steps";
import { AdvantagesSection } from "@/components/modules/provider/signup_page/provider-advantages";

import { ProviderBanner } from "@/components/modules/provider/signup_page/provider-banner";
import { HowItWorks } from "@/components/modules/provider/signup_page/provider-how-it-works";


export default function Page() {
  return (
    <div className="max-w-7xl mx-auto">
       <ProviderBanner />
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      {/* banner */}
     
      <div className="w-full max-w-sm">
        
        <ProviderSignupForm />
        {/*  */}
      </div>
     
    </div>
       <StepsToActivation />
       <AdvantagesSection />
       <HowItWorks />
    </div>
  );
}