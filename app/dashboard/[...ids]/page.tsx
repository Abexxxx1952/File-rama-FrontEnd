import type { Metadata } from "next";

import { DashboardPage } from "@/srcApp/pages/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Manage your files and folders in File-rama - organize, upload, and access your cloud storage",
  icons: "/meta-icon.svg",
  keywords: [
    "dashboard",
    "file manager",
    "cloud storage",
    "file organization",
    "File-rama",
  ],
  openGraph: {
    title: "Dashboard | File-rama",
    description: "Manage your files and folders in File-rama",
    images: [
      {
        url: "/meta-icon.svg",
        width: 512,
        height: 512,
        alt: "File-rama Dashboard",
      },
    ],
  },
};

type DashboardRouteProps = {
  params: Promise<{ ids: string[] }>;
};

export default async function Page(props: DashboardRouteProps) {
  const { ids = ["null"] } = await props.params;

  return <DashboardPage ids={ids} />;
}
