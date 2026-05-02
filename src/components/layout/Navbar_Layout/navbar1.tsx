"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../modeToggle";
import { authClient } from "@/lib/auth-client";
import { useCartStore } from "@/stores/cartStore";
import { Logo } from "./Logo";
import { DesktopMenu } from "./DesktopMenu";
import { MobileMenu } from "./MobileMenu";
import { CartIcon } from "./CartIcon";
import { AuthButtons } from "./AuthButtons";

const menuItems = [
  { title: "Home", url: "/" },
  { title: "Meals", url: "/meals" },
  { title: "Dashboard", url: "/dashboard" },
];

interface Navbar1Props {
  className?: string;
}

export function Navbar1({ className }: Navbar1Props) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { fetchCart, getTotalItems, clearCart } = useCartStore();
  const totalItems = getTotalItems();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (session?.user) fetchCart();
  }, [session?.user, fetchCart]);

  const handleLogout = async () => {
    await authClient.signOut();
    clearCart();
    router.push("/login");
  };

  return (
    <section className={cn("py-4", className)}>
      <div className="container mx-auto px-4">
        {/* Desktop */}
        <div className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            <Logo title="FoodHub" />
            <DesktopMenu items={menuItems} />
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <CartIcon itemCount={totalItems} />
            <AuthButtons
              session={session}
              isPending={isPending}
              onLogout={handleLogout}
              loginUrl="/login"
              signupUrl="/signup"
            />
          </div>
        </div>

        {/* Mobile */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Logo title="FoodHub" />
            <div className="flex items-center gap-2">
              <CartIcon itemCount={totalItems} />
              <MobileMenu logoTitle="FoodHub" open={mobileOpen} onOpenChange={setMobileOpen}>
                <div className="flex flex-col gap-3">
                  {menuItems.map((item) => (
                    <button
                      key={item.title}
                      onClick={() => {
                        router.push(item.url);
                        setMobileOpen(false);
                      }}
                      className="text-md font-semibold py-2 text-left"
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  <ModeToggle />
                  <AuthButtons
                    session={session}
                    isPending={isPending}
                    onLogout={handleLogout}
                    loginUrl="/login"
                    signupUrl="/signup"
                  />
                </div>
              </MobileMenu>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}