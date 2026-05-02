"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, ShoppingBag, Heart, Gift, HelpCircle, Settings, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function UserProfileDropdown({ user, onLogout }: { user: { name?: string; email?: string }; onLogout: () => void }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (showConfirm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-slate-950">
          <h3 className="text-lg font-semibold">Confirm Logout</h3>
          <p className="mt-2 text-sm text-muted-foreground">Are you sure you want to logout?</p>
          <div className="mt-6 flex gap-3">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { setShowConfirm(false); onLogout(); }}>Logout</Button>
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
          <p className="text-xs text-muted-foreground">{user.email || ""}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild><Link href="/account/myProfile"><User className="mr-2 h-4 w-4" />My Profile</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link href="/orders"><ShoppingBag className="mr-2 h-4 w-4" />My Orders</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link href=""><Heart className="mr-2 h-4 w-4" />Favorites</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link href="/vouchers"><Gift className="mr-2 h-4 w-4" />Vouchers</Link></DropdownMenuItem>
         
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild><Link href=""><Settings className="mr-2 h-4 w-4" />Settings</Link></DropdownMenuItem>
           <DropdownMenuItem asChild><Link href="/help-center"><HelpCircle className="mr-2 h-4 w-4" />Help Center</Link></DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowConfirm(true)} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}