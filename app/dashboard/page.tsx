import type { Metadata } from "next";
import { DashboardPage } from "@/srcApp/pages/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your dashboard",
  icons: "/meta-icon.svg",
};

export default DashboardPage;
