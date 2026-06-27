import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import { Navbar1 } from "@/components/layout/navbar1";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FoodGhor",
  description: "FoodGhor is a food delivery app built with Next.js, Prisma, and BetterAuth. It provides a seamless experience for users to order their favorite meals from local restaurants and have them delivered to their doorstep. With a user-friendly interface and secure authentication, FoodGhor aims to make food ordering convenient and enjoyable for everyone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body 
      suppressHydrationWarning
      className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          // enableSystem
          disableTransitionOnChange
          
        >
    
          {children}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}