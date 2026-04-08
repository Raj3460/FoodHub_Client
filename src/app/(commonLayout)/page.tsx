import { Button } from "@/components/ui/button";
import HeroSection from "../../components/modules/homepage/HeroSection";
import CategorySection from "../../components/modules/homepage/CategorySection";
import { cookies } from "next/headers";

export default async function HomePage() {


 

  return (
    <div>
      <HeroSection />
      <CategorySection />
    </div>
  );
}
