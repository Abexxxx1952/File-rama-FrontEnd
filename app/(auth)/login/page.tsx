import type { Metadata } from "next";

import { LoginPage } from "@/srcApp/pages/login";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to your File-rama account to access your files and folders securely",
  icons: "/meta-icon.svg",
  keywords: ["login", "sign in", "authentication", "file storage", "File-rama"],
  openGraph: {
    title: "Login | File-rama",
    description: "Sign in to your File-rama account",
    images: [
      {
        url: "/meta-icon.svg",
        width: 512,
        height: 512,
        alt: "File-rama Login",
      },
    ],
  },
};

export default LoginPage;
