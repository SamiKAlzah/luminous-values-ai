import type { Metadata } from "next";
import { Cairo, Amiri } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
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

// Applies the saved theme before first paint so there is no flash.
// Default is light (Najd); the system colour scheme is deliberately ignored.
const themeScript = `try{var t=localStorage.getItem("lv-theme");if(t==="dark"||t==="emerald"||t==="light"){document.documentElement.dataset.theme=t}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      data-theme="light"
      suppressHydrationWarning
      className={`${cairo.variable} ${amiri.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
