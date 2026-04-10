"use client";

import { Menu, User, ShoppingBag, Heart, Gift, HelpCircle, Settings, LogOut } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ModeToggle } from "./modeToggle";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

const UserProfileDropdown = ({
  user,
  onLogout,
}: UserProfileDropdownProps) => {
  const router = useRouter();
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
            <Button
              variant="outline"
              onClick={() => setShowLogoutConfirm(false)}
            >
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
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-accent"
        >
          <Avatar size="default">
            <AvatarImage src="" alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* Top Section: User Info */}
        <div className="px-2 py-3">
          <p className="font-semibold text-foreground">{user.name || "User"}</p>
          <p className="text-xs text-muted-foreground">{user.email || "No email"}</p>
        </div>

        <DropdownMenuSeparator />

        {/* Middle Section: Menu Items */}
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

        {/* Bottom Section: Settings & Logout */}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/settings" className="flex items-center gap-2">
              <Settings className="size-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={handleLogoutClick}
            className="cursor-pointer flex items-center gap-2"
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
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await authClient.getSession();
        setSession(data);
      } catch (error) {
        setSession(null);
      } finally {
        setLoading(false);
      }
    };
    getSession();
  }, []);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      setSession(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const renderAuthButtons = () => {
    if (loading) {
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
    <section  className=  {cn("py-4", className)}>
      <div className="container mx-auto px-4">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
             <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-white">
                F
              </span>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          <div className="flex gap-2">
            <ModeToggle />
            {renderAuthButtons()}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link href={logo.url} className="flex items-center gap-2">
               <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500 text-white">
                F
              </span>
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
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
                    <Link href={logo.url} className="flex items-center gap-2">
                      <img
                        src={logo.src}
                        className="max-h-8 dark:invert"
                        alt={logo.alt}
                      />
                      <span className="text-lg font-semibold tracking-tighter">
                        {logo.title}
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion type="single" collapsible className="flex w-full flex-col gap-4">
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    <ModeToggle />
                    {session?.user ? (
                      <>
                        <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                          <Avatar size="sm">
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
                          <Link href="/account/orders" className="flex items-center gap-2">
                            <ShoppingBag className="size-4" />
                            Orders
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link href="/account/settings" className="flex items-center gap-2">
                            <Settings className="size-4" />
                            Settings
                          </Link>
                        </Button>
                        <Button onClick={handleLogout} variant="destructive" size="sm" className="flex items-center gap-2">
                          <LogOut className="size-4" />
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

const renderMobileMenuItem = (item: MenuItem) => {
  return (
    <Link
      key={item.title}
      href={item.url}
      className="text-md font-semibold"
    >
      {item.title}
    </Link>
  );
};

export { Navbar1 };