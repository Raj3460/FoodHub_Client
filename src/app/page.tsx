import { Button } from "@/components/ui/button";
import HeroSection from "../components/modules/homepage/HeroSection";
import CategorySection from "../components/modules/homepage/CategorySection";
import { cookies } from "next/headers";

export default async function HomePage() {


  const cookieStore =  await cookies();

  const res = await fetch("http://localhost:5000/api/auth/get-session", {
    headers: {
      cookie: cookieStore.toString(),
    },
  });
  
  const session = await res.json();
  console.log(session);


  return (
    <div>
      <HeroSection />
      <CategorySection />
    </div>
  );
}
