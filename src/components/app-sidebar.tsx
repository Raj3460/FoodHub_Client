"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Utensils,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  HelpCircle,
  Store,
  PanelLeftClose,
  PanelLeftOpen,
  Truck,
  MapPin,
  BarChart3,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function SidebarCollapseToggle() {
  const { toggleSidebar, open } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className={cn(
        "h-8 w-8 rounded-md transition-all duration-200",
        "hover:bg-orange-50 hover:text-orange-500",
        "text-muted-foreground"
      )}
      aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
      title={open ? "Collapse sidebar" : "Expand sidebar"}
    >
      {open ? (
        <PanelLeftClose className="h-4 w-4" />
      ) : (
        <PanelLeftOpen className="h-4 w-4" />
      )}
    </Button>
  );
}

const menuItems = {
  // ✅ Admin Panel
  admin: [
    {
      title: "Platform",
      items: [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Providers", href: "/admin/providers", icon: Store },
        { name: "Riders", href: "/admin/riders", icon: Truck },
        { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
      ],
    },
    {
      title: "Content",
      items: [
        { name: "Categories", href: "/admin/categories", icon: Settings },
        { name: "Help", href: "/admin/help", icon: HelpCircle },
      ],
    },
  ],

  // ✅ Provider Panel
  provider: [
    {
      title: "Management",
      items: [
        { name: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard },
        { name: "My Menu", href: "/provider/menu", icon: Utensils },
        { name: "Orders", href: "/provider/orders", icon: ShoppingBag },
      ],
    },
    {
      title: "Account",
      items: [
        { name: "Profile", href: "/provider/profile", icon: Settings },
        { name: "Help", href: "/provider/help", icon: HelpCircle },
      ],
    },
  ],

  // ✅ Rider Panel — নতুন যোগ হলো
  rider: [
    {
      title: "Deliveries",
      items: [
        { name: "Dashboard", href: "/rider/dashboard", icon: LayoutDashboard },
        { name: "Active Delivery", href: "/rider/active-delivery", icon: MapPin },
        { name: "My Deliveries", href: "/rider/deliveries", icon: Truck },
      ],
    },
    {
      title: "Account",
      items: [
        { name: "Stats", href: "/rider/stats", icon: BarChart3 },
        { name: "Profile", href: "/rider/profile", icon: Settings },
        { name: "Help", href: "/rider/help", icon: HelpCircle },
      ],
    },
  ],

  // ❌ Customer মুছে দেওয়া হয়েছে
  // Customer কে Profile থেকে Handle করা হবে
};

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const role = (session?.user as any)?.role?.toLowerCase?.() || "";

  const handleConfirmLogout = async () => {
    setDialogOpen(false);
    try {
      setIsLoggingOut(true);
      await authClient.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isPending) {
    return <div className="w-64 border-r p-4">Loading...</div>;
  }

  // ✅ Customer হলে Sidebar দেখাবে না
  if (role === "customer" || !menuItems[role as keyof typeof menuItems]) {
    return null;
  }

  const items = menuItems[role as keyof typeof menuItems];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-2">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-orange-500 hover:opacity-80 transition-opacity group-data-[collapsible=icon]:hidden"
          >
            FoodGhor
          </Link>
          <SidebarCollapseToggle />
        </div>
        <p className="text-xs text-muted-foreground capitalize group-data-[collapsible=icon]:hidden">
          {role} Panel
        </p>
      </SidebarHeader>

      <SidebarContent>
        {items.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-2">
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogTrigger asChild>
            <SidebarMenuButton
              className="text-destructive w-full"
              disabled={isLoggingOut}
            >
              <LogOut className="h-4 w-4" />
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </SidebarMenuButton>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You will be logged out of your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmLogout}>
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}