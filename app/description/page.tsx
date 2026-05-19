import type { Metadata } from "next";

import { DescriptionPage } from "@/srcApp/pages/description";

export const metadata: Metadata = {
  title: "Description",
  description:
    "Learn how File-rama works - discover features, benefits, and how to manage your files efficiently in the cloud",
  icons: "/meta-icon.svg",
  keywords: [
    "how it works",
    "features",
    "file storage guide",
    "cloud storage",
    "File-rama",
  ],
  openGraph: {
    title: "How It Works | File-rama",
    description: "Learn how File-rama works and manage your files efficiently",
    images: [
      {
        url: "/meta-icon.svg",
        width: 512,
        height: 512,
        alt: "File-rama Description",
      },
    ],
  },
};

export default DescriptionPage;
