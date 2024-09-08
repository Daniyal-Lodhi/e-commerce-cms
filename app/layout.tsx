import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { ModalProvider } from "@/providers/modal-provider";
import ToastProvider from "@/providers/toast-provider";
import { ThemeProvider } from "@/components/theme-provider";
const inter = Inter({ subsets: ["latin"] });

let title = "CMS";

export const metadata: Metadata = {
  title: {
    template: `${title} | %s`, // Template for dynamic title
    default: `${title} Dashboard`, // Absolute title
  },
  description: "CMS dashboard",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <ClerkProvider>
      <html lang="en"
        suppressHydrationWarning={true}

      >


        <body className={inter.className}
          suppressHydrationWarning={true}

        >
          <ThemeProvider

            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <ToastProvider />
            <ModalProvider />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
