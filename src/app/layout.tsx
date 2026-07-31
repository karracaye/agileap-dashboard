import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgileAP – Accounts Payable Dashboard",
  description: "Streamline your accounts payable workflow with AgileAP – Bills, Invoices, Purchase Orders and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
