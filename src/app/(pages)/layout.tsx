"use client";
import { AdminProvider } from "@/context/AdminContext";
import { UnitProvider } from "@/context/UnitContext";
import { SessionProvider } from "next-auth/react";
import { QueryClientProvider, QueryClient } from "react-query";

const queryClient = new QueryClient();

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <AdminProvider>
            <UnitProvider>{children}</UnitProvider>
          </AdminProvider>
        </SessionProvider>
      </QueryClientProvider>
    </section>
  );
}
