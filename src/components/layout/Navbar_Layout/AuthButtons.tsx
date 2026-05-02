"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserProfileDropdown } from "./UserProfileDropdown";

export function AuthButtons({ session, isPending, onLogout, loginUrl, signupUrl }: any) {
  if (isPending) {
    return <Button variant="outline" size="sm" disabled>Loading...</Button>;
  }
  if (session?.user) {
    return <UserProfileDropdown user={session.user} onLogout={onLogout} />;
  }
  return (
    <div className="flex gap-2">
      <Button asChild variant="outline" size="sm"><Link href={loginUrl}>Login</Link></Button>
      <Button asChild size="sm"><Link href={signupUrl}>Sign up</Link></Button>
    </div>
  );
}