import type { Metadata } from "next";

import { StatisticPage } from "@/srcApp/pages/statistic";

export const metadata: Metadata = {
  title: "Statistics",
  description:
    "View your File-rama usage statistics - track storage, file activity, and account metrics",
  icons: "/icons/logo.svg",
  keywords: [
    "statistics",
    "usage stats",
    "storage metrics",
    "file activity",
    "File-rama",
  ],
  openGraph: {
    title: "Statistics | File-rama",
    description: "View your File-rama usage statistics and metrics",
    images: [
      {
        url: "/meta-icon.svg",
        width: 512,
        height: 512,
        alt: "File-rama Statistics",
      },
    ],
  },
};

export default StatisticPage;
