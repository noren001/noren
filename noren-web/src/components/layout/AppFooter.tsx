"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import DashboardFooter from "./DashboardFooter";

export default function AppFooter() {
  const pathname = usePathname();
  return pathname?.startsWith("/dashboard") ? <DashboardFooter /> : <Footer />;
}
