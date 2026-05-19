import type { Metadata } from "next";

import { RegistrationPage } from "@/srcApp/pages/registration";

export const metadata: Metadata = {
  title: "Registration",
  description:
    "Create your File-rama account and start storing your files securely in the cloud",
  icons: "/meta-icon.svg",
  keywords: [
    "registration",
    "sign up",
    "create account",
    "file storage",
    "File-rama",
  ],
  openGraph: {
    title: "Registration | File-rama",
    description: "Create your File-rama account",
    images: [
      {
        url: "/meta-icon.svg",
        width: 512,
        height: 512,
        alt: "File-rama Registration",
      },
    ],
  },
};

export default RegistrationPage;
