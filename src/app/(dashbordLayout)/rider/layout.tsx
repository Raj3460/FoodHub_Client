import { userService } from "@/services/user.service";
import { redirect } from "next/navigation";

export default async function RiderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ Fetch session on the server
  const { data: session, error } = await userService.getSession();

  // ❌ No session → redirect to login
  if (error || !session) {
    redirect("/rider/login");
  }

  // ❌ Not a rider → redirect to home
  if (session.user?.role !== "RIDER") {
    redirect("/");
  }

  // ✅ All good → render the page
  return <>{children}</>;
}