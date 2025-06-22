import type { Metadata } from "next";
import { LoginPage } from "@/srcApp/pages/login";

export const metadata: Metadata = {
  title: "login",
  description: "Login to your account",
  icons: "/meta-icon.svg",
};

export default LoginPage;
