

import { Navbar1 } from "@/components/layout/Navbar_Layout/navbar1";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
       <Navbar1 className="sticky top-0 z-50 bg-background"/>
      {children}
    </div>
  );
}
