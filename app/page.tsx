import type { Metadata } from "next";
import { MainPage } from "@/srcApp/pages/main";

export const metadata: Metadata = {
  /*  metadataBase: new URL(`${process.env.SITE_URL}`), */
  title: { default: "File-rama - Files storage", template: "%s | File-rama" },
  description: "File storage service",
  icons: "/meta-icon.svg",
  keywords: ["File", "storage", "service", "File storage service"],
  openGraph: {
    title: "File-rama - files storage",
    description: "Files storage",
    images: [
      {
        url: "/meta-icon.svg",
        width: 512,
        height: 512,
        alt: "File-rama",
      },
    ],
  },
};

export default MainPage;
