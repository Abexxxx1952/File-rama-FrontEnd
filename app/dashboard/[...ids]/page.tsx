import type { Metadata } from "next";
import { DashboardPage } from "@/srcApp/pages/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your dashboard",
  icons: "/meta-icon.svg",
};

type DashboardRouteProps = {
  params: Promise<{ ids: string[] }>;
};

export default async function Page(props: DashboardRouteProps) {
  const { ids = ["null"] } = await props.params;

  return <DashboardPage ids={ids} />;
}
