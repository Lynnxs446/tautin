import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login — Tautin",
  description: "Login ke admin panel Tautin",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
