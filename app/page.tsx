import { MainPage } from "@/srcApp/pages/main";

import type { Metadata } from "next";

export const metadata: Metadata = {
  /*  metadataBase: new URL(`${process.env.SITE_URL}`), */
  title: { default: "File-rama - Files storage", template: "%s | File-rama" },
  description: "File storage service",
  icons: "/icons/logo.svg",
  keywords: ["File", "storage", "service", "File storage service"],
  openGraph: {
    title: "File-rama - files storage",
    description: "Files storage",
    images: [
      {
        url: "/icons/logo.svg",
        width: 512,
        height: 512,
        alt: "File-rama",
      },
    ],
  },
};

export default MainPage;
