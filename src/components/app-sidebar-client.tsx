"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
// import { signOut } from "@/lib/auth-client";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Tag,
  Store,
  UtensilsCrossed,
  ClipboardList,
  User,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

// ✅ Session type
type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
} | null;

type Session = {
  user: SessionUser;
} | null;

// ✅ Role অনুযায়ী menu
const sidebarConfig = {
  ADMIN: [
    {
      title: "Management",
      items: [
        { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Users", href: "/admin/users", icon: Users },
        { label: "All Orders", href: "/admin/orders", icon: ShoppingBag },
        { label: "Categories", href: "/admin/categories", icon: Tag },
        { label: "Providers", href: "/admin/providers", icon: Store },
      ],
    },
  ],
  PROVIDER: [
    {
      title: "My Restaurant",
      items: [
        { label: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard },
        { label: "My Menu", href: "/provider/menu", icon: UtensilsCrossed },
        { label: "Orders", href: "/provider/orders", icon: ClipboardList },
        { label: "Profile", href: "/provider/profile", icon: User },
      ],
    },
  ],
  CUSTOMER: [
    {
      title: "My Account",
      items: [
        { label: "Dashboard", href: "/customer/dashboard", icon: LayoutDashboard },
        { label: "My Orders", href: "/customer/orders", icon: ShoppingBag },
        { label: "Profile", href: "/customer/profile", icon: User },
      ],
    },
  ],
};

type Props = React.ComponentProps<typeof Sidebar> & {
  session: Session;
};

export function AppSidebarClient({ session, ...props }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const role =
    (session?.user?.role as keyof typeof sidebarConfig) || "CUSTOMER";
  const groups = sidebarConfig[role] || [];

  const handleLogout = async () => {
//     await signOut();
    toast.success("Logged out!");
    router.push("/login");
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>

      {/* Header */}
      <SidebarHeader className="border-b px-4 py-4">
        <Link href="/" className="text-xl font-bold text-orange-500">
          FoodHub 🍱
        </Link>
        <span className={cn(
          "text-xs font-medium px-2 py-1 rounded-full w-fit",
          role === "ADMIN" && "bg-purple-100 text-purple-700",
          role === "PROVIDER" && "bg-blue-100 text-blue-700",
          role === "CUSTOMER" && "bg-orange-100 text-orange-700",
        )}>
          {role}
        </span>
      </SidebarHeader>

      {/* Menu */}
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={cn(
                          isActive &&
                            "bg-orange-500 text-white hover:bg-orange-600 hover:text-white"
                        )}
                      >
                        <Link href={item.href}>
                          <Icon size={16} />
                          <span>{item.label}</span>
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

      {/* Footer — User info + Logout */}
      <SidebarFooter className="border-t px-4 py-3 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm shrink-0">
            {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {session?.user?.name ?? "Guest"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {session?.user?.email ?? ""}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full text-sm text-gray-500 hover:text-red-500 px-2 py-2 rounded-lg hover:bg-red-50 transition"
        >
          <LogOut size={15} />
          Logout
        </button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}