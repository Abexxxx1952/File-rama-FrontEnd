import type { Metadata } from "next";

import { SettingsPage } from "@/srcApp/pages/settings";

export const metadata: Metadata = {
  title: "Settings",
  description:
    "Manage your File-rama account settings - update profile, security, and preferences",
  icons: "/icons/logo.svg",
  keywords: [
    "settings",
    "account settings",
    "profile",
    "preferences",
    "File-rama",
  ],
  openGraph: {
    title: "Settings | File-rama",
    description: "Manage your File-rama account settings",
    images: [
      {
        url: "/meta-icon.svg",
        width: 512,
        height: 512,
        alt: "File-rama Settings",
      },
    ],
  },
};

export default SettingsPage;
