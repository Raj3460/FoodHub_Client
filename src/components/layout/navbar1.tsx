"use client";

import { Menu, User, ShoppingBag, Heart, Gift, HelpCircle, Settings, LogOut, ShoppingCart } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ModeToggle } from "./modeToggle";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import { useEffect, useState } from "react";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  className?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
    className?: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

// User Profile Dropdown Component
interface UserProfileDropdownProps {
  user: {
    name?: string;
    email?: string;
  };
  onLogout: () => void;
}

const UserProfileDropdown = ({ user, onLogout }: UserProfileDropdownProps) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (showLogoutConfirm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-slate-950">
          <h3 className="text-lg font-semibold text-foreground">Confirm Logout</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Are you sure you want to logout?
          </p>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={() => setShowLogoutConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-3">
          <p className="font-semibold text-foreground">{user.name || "User"}</p>
          <p className="text-xs text-muted-foreground">{user.email || "No email"}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/account/myProfile" className="flex items-center gap-2">
              <User className="size-4" />
              <span>My Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/orders" className="flex items-center gap-2">
              <ShoppingBag className="size-4" />
              <span>My Orders</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/favorites" className="flex items-center gap-2">
              <Heart className="size-4" />
              <span>Favorites</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/vouchers" className="flex items-center gap-2">
              <Gift className="size-4" />
              <span>Vouchers</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/help" className="flex items-center gap-2">
              <HelpCircle className="size-4" />
              <span>Help Center</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/settings" className="flex items-center gap-2">
              <Settings className="size-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleLogoutClick}
            className="cursor-pointer flex items-center gap-2 text-red-600 focus:text-red-600"
          >
            <LogOut className="size-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Navbar1 = ({
  logo = {
    url: "/",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
    alt: "logo",
    title: "FoodHub",
  },
  menu = [
    { title: "Home", url: "/" },
    { title: "Meals", url: "/meals" },
    { title: "Providers", url: "/providers" },
  ],
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Sign up", url: "/signup" },
  },
  className,
}: Navbar1Props) => {
  const router = useRouter();
  const { items, fetchCart, getTotalItems, clearCart } = useCartStore();
  const totalItems = getTotalItems();

  // ✅ Better Auth's built-in hook - automatically updates UI after login/logout
  const { data: session, isPending } = authClient.useSession();

  // ✅ Fetch cart when user logs in or component mounts
  useEffect(() => {
    if (session?.user) {
      fetchCart();
    }
  }, [session?.user, fetchCart]);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      clearCart();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const renderAuthButtons = () => {
    if (isPending) {
      return (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Loading...
          </Button>
        </div>
      );
    }

    if (session?.user) {
      return (
        <div className="flex items-center gap-3">
          <UserProfileDropdown
            user={{
              name: session.user.name,
              email: session.user.email,
            }}
            onLogout={handleLogout}
          />
        </div>
      );
    }

    return (
      <div className="flex gap-2">
        <Button asChild variant="outline" size="sm">
          <Link href={auth.login.url}>{auth.login.title}</Link>
        </Button>
        <Button asChild size="sm">
          <Link href={auth.signup.url}>{auth.signup.title}</Link>
        </Button>
      </div>
    );
  };

  return (
    <section className={cn("py-4", className)}>
      <div className="container mx-auto px-4">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-white font-bold text-lg">
                F
              </span>
              <span className="text-lg font-semibold tracking-tighter">{logo.title}</span>
            </Link>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ModeToggle />
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            {renderAuthButtons()}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-white font-bold text-lg">
                F
              </span>
              <span className="text-lg font-semibold tracking-tighter">{logo.title}</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/cart" className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>
                      <Link href="/" className="flex items-center gap-2">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-white font-bold text-lg">
                          F
                        </span>
                        <span className="text-lg font-semibold tracking-tighter">
                          {logo.title}
                        </span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 p-4">
                    <div className="flex flex-col gap-3">
                      {menu.map((item) => (
                        <Link key={item.title} href={item.url} className="text-md font-semibold py-2">
                          {item.title}
                        </Link>
                      ))}
                    </div>
                    <div className="flex flex-col gap-3">
                      <ModeToggle />
                      {session?.user ? (
                        <>
                          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="" alt={session.user.name} />
                              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                                {session.user.name
                                  ?.split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground truncate">
                                {session.user.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {session.user.email}
                              </p>
                            </div>
                          </div>
                          <Button asChild variant="outline" size="sm">
                            <Link href="/account/myProfile" className="flex items-center gap-2">
                              <User className="size-4" />
                              Profile
                            </Link>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <Link href="/orders" className="flex items-center gap-2">
                              <ShoppingBag className="size-4" />
                              Orders
                            </Link>
                          </Button>
                          <Button onClick={handleLogout} variant="destructive" size="sm">
                            Logout
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button asChild variant="outline">
                            <Link href={auth.login.url}>{auth.login.title}</Link>
                          </Button>
                          <Button asChild>
                            <Link href={auth.signup.url}>{auth.signup.title}</Link>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink asChild>
        <Link
          href={item.url}
          className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
        >
          {item.title}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

export { Navbar1 };