"use client"; // Permite o uso de hooks no componente

import { ReactNode } from "react";
import { Sidebar } from "@/app/dashboard/components/siderbar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname(); // Obtém a rota atual
  const isDashboardPage = pathname === "/dashboard"; // Verifica se está na página `/dashboard`

  return (
    <>
      <Sidebar />
      <div
        className={`w-full flex items-center justify-between mx-auto mt-10 ${
          isDashboardPage ? "" : "max-w-7xl" // Remove `max-w-7xl` apenas no `/dashboard`
        }`}
      >
        {children}
      </div>
    </>
  );
}
