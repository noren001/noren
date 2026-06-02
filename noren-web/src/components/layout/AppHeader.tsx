"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import DashboardHeader from "./DashboardHeader";

export default function AppHeader() {
  const pathname = usePathname();
  return pathname?.startsWith("/dashboard") ? <DashboardHeader /> : <Header />;
}
