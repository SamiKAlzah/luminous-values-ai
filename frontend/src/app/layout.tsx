import type { Metadata } from "next";
import { Cairo, Amiri } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "قيم مضيئة AI | تهدي الروح إلى هدوئها",
  description: "تحدي الذكاء الاصطناعي في خدمة المحتوى الإسلامي 2026 - تجربة تفاعلية لتحويل القيم الإسلامية إلى سلوك ملاحظ ومقاس مع التأصيل الشرعي الصارم ومقاومة الهلوسة.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${amiri.variable}`}>
      <body className="antialiased min-h-screen flex flex-col font-sans selection:bg-[#2EF2C2] selection:text-[#12183F]">
        {children}
      </body>
    </html>
  );
}
