"use client";

import { Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "@/components/ui/alert-dialog";
import { SidebarTrigger } from "@/components/ui/sidebar"; // ✅ Shadcn sidebar toggle
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DashboardHeader() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  // Get session data
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as any;
  const userName = user?.name || "User";
  const userEmail = user?.email || "user@foodhub.com";
  const userRole = user?.role || "customer";
  const userAvatar = user?.image || `https://avatar.vercel.sh/${userEmail}`;

  const handleLogout = async () => {
    setLogoutDialogOpen(false);
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

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isPending) {
    return (
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      {/* Left section: sidebar toggle + optional search (hidden for simplicity) */}
     

      {/* Right section: notifications + user menu */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </Button>

        {/* User Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 rounded-full hover:bg-accent"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="bg-orange-500 text-white">
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex md:flex-col md:items-start">
                <span className="text-sm font-medium capitalize">
                  {userName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {userEmail}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="capitalize">
              {userRole} Account
            </DropdownMenuLabel>
            {/* <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuSeparator /> */}
            {/* Logout with confirmation dialog */}
            {/* <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onSelect={(e) => {
                    e.preventDefault(); // prevent dropdown from closing
                    setLogoutDialogOpen(true);
                  }}
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
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
                  <AlertDialogAction onClick={handleLogout}>
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}