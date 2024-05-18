import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import "@uploadthing/react/styles.css";
import { ThemeProvider } from "@/providers/theme-provider";
import ModalProvider from "@/providers/modal-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnarToaster } from "@/components/ui/sonner";

const inter = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Luxy",
  description: "Website builder for the modern web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ModalProvider>
            {children}
            <Toaster />
            <SonnarToaster />
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
