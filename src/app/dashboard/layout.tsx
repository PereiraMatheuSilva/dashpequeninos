"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/app/dashboard/components/siderbar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboardPage = pathname === "/dashboard";
  const isRelatorioPage = pathname === "/dashboard/relatorio";

  return (
    <>
      <Sidebar />
      <div
        className={`w-full xl:w-4xl flex items-center justify-between mx-auto
          ${isDashboardPage ? "" : "max-w-7xl"}
          ${isRelatorioPage ? "" : "mt-10"}
          ${isRelatorioPage ? "xl:ml-72" : "xl:ml-72"}
        `}
      >
        {children}
      </div>
    </>
  );
}
