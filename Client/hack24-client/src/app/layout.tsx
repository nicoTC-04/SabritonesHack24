"use client";

import { usePathname } from 'next/navigation'; // Import usePathname
import localFont from "next/font/local";
import Navbar from "../components/landing/navbar";
import StudentClass from "@/components/misclases/StudentClass"; // Import the StudentClass component
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideNavbar = pathname.startsWith('/meet');

  return (
    <html lang="en">
      <body>
        {!hideNavbar && <Navbar />}
        {children}
      </body>
    </html>
  );
}
