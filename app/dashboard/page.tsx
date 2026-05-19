import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Access your File-rama dashboard to manage files and folders",
  icons: "/meta-icon.svg",
};

export default function DashboardIndexPage() {
  redirect("/dashboard/null");
}
