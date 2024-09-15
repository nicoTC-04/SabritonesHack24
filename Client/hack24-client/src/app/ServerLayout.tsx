import type { Metadata } from "next";
import RootLayout from './layout';

export const metadata: Metadata = {
  title: "Palestra",
  description: "Education platform for students and teachers",
};

export default function ServerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootLayout>
      {children}
    </RootLayout>
  );
}