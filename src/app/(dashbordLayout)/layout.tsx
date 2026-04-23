"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/layout/Dashboard_layout/dashboard-header";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider >
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          {/* Header with SidebarTrigger */}
          <header className="flex h-16 shrink-0 items-center justify-between bg-background gap-2 border-b px-4 sticky top-0 z-30">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DashboardHeader />
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}