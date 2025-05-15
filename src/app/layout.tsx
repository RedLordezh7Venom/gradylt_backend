import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FloatingSocial from "@/components/FloatingSocial";
import Footer from "@/components/Footer";
import TrackingProvider from "@/components/TrackingProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Job & Student Portal",
  description: "Sign up and login portal for students and employers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <TrackingProvider>
          {children}
          <Footer />
          <FloatingSocial
            whatsappNumber="+1234567890"
            whatsappMessage="Hello! I'm interested in learning more about your services."
            facebookUrl="https://facebook.com"
            twitterUrl="https://twitter.com"
            linkedinUrl="https://linkedin.com"
            instagramUrl="https://instagram.com"
          />
        </TrackingProvider>
      </body>
    </html>
  );
}
