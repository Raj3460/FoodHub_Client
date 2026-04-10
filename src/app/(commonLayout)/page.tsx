import { Button } from "@/components/ui/button";
import HeroSection from "../../components/modules/homepage/HeroSection";
import CategorySection from "../../components/modules/homepage/CategorySection";
import { cookies } from "next/headers";
import { userService } from "@/services/user.service";
import FeaturedProvidersSection from "@/components/modules/homepage/FeaturedProvidersSection";
import PopularMealsSection from "@/components/modules/homepage/PopularMealsSection";
import Footer from "@/components/layout/footer";

export default async function HomePage() {


//  const session =await userService.getSession();
//  console.log(session);

  return (
    <div>
      <HeroSection />
      <CategorySection />
      <FeaturedProvidersSection></FeaturedProvidersSection>
      <PopularMealsSection />
      <Footer></Footer>
    </div>
  );
}
