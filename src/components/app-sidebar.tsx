"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

// Role-based menu items
const menuItems = {
  admin: [
    {
      title: "Platform",
      items: [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Providers", href: "/admin/providers", icon: Store },
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
  provider: [
    {
      title: "Management",
      items: [
        {
          name: "Dashboard",
          href: "/provider/dashboard",
          icon: LayoutDashboard,
        },
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
  customer: [
    {
      title: "Overview",
      items: [
        {
          name: "Dashboard",
          href: "/customer/dashboard",
          icon: LayoutDashboard,
        },
        { name: "My Orders", href: "/customer/orders", icon: ShoppingBag },
        { name: "Favorites", href: "/customer/favorites", icon: Utensils },
      ],
    },
    {
      title: "Settings",
      items: [
        { name: "Profile", href: "/customer/profile", icon: Settings },
        { name: "Help", href: "/customer/help", icon: HelpCircle },
      ],
    },
  ],
};

export function AppSidebar() {
  const pathname = usePathname();

  // ✅ Session থেকে role নেওয়া
  const { data: session, isPending } = authClient.useSession();
  console.log("Session in AppSidebar:", session);
  const role = (session?.user as any)?.role?.toLowerCase?.() || "customer";
  console.log("Determined role in AppSidebar:", role);
  

  if (isPending) {
    return <div className="w-64 border-r p-4">Loading...</div>;
  }
  const items = menuItems[role as keyof typeof menuItems] || menuItems.customer;

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <Link href="/" className="block hover:opacity-80 transition-opacity">
          <h1 className="text-xl font-bold text-orange-500">FoodHub</h1>
          <p className="text-xs text-muted-foreground capitalize">
            {role} Panel
          </p>
        </Link>
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

      <SidebarFooter className="border-t p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-destructive">
              <Link href="/login">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
