import type { Metadata } from "next";
import { dm_sans } from "@/styles/fonts";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { ToasterProvider } from "@/providers/toaster-provider";
import { QueryClientProvider } from "@/providers/query-client-provider";
import { ErrorBoundary } from "@/components/error-boundary";


export const metadata: Metadata = {
  title: "EstateFlow - Gestion Immobilière",
  description: "Plateforme SaaS de gestion immobilière pour propriétaires, gestionnaires et locataires",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          async
          crossOrigin="anonymous"
          src="https://tweakcn.com/live-preview.min.js"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          dm_sans.variable
        )}
      >
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryClientProvider> {/* Pour React Query */}
              <AuthProvider> {/* Gère l'état d'auth */}
                {children}
                <ToasterProvider />
              </AuthProvider>
            </QueryClientProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
