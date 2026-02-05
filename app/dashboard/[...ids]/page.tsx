import type { Metadata } from "next";
import { DashboardPage } from "@/srcApp/pages/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your dashboard",
  icons: "/meta-icon.svg",
};

export default async function Page({
  params,
}: {
  params: Promise<{ ids: string[] }>;
}) {
  const resolvedParams = await params;
  let { ids } = resolvedParams;
  ids = ids ?? ["null"];

  return <DashboardPage ids={ids} />;
}
