"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Logo } from "./Logo";

interface MobileMenuProps {
  logoTitle: string;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileMenu({ logoTitle, children, open, onOpenChange }: MobileMenuProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto w-80 sm:w-96">
        <SheetHeader>
          <SheetTitle>
            <Logo title={logoTitle} />
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6 p-4">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}