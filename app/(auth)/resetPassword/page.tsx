import type { Metadata } from "next";

import { ResetPasswordPage } from "@/srcApp/pages/reset-password";

export const metadata: Metadata = {
  title: "Reset Password",
  description:
    "Reset your File-rama account password securely and regain access to your files",
  icons: "/meta-icon.svg",
  keywords: [
    "reset password",
    "forgot password",
    "password recovery",
    "File-rama",
  ],
  openGraph: {
    title: "Reset Password | File-rama",
    description: "Reset your File-rama account password",
    images: [
      {
        url: "/meta-icon.svg",
        width: 512,
        height: 512,
        alt: "File-rama Password Reset",
      },
    ],
  },
};

export default ResetPasswordPage;
