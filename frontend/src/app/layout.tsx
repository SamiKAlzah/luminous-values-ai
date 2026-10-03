import type { Metadata } from "next";
import { Cairo, Amiri } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../components/LanguageProvider";
import Header from "../components/Header";
import SiteFooter from "../components/SiteFooter";

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
        <LanguageProvider>
          <a
            href="#main"
            className="sr-only rounded-md bg-brand px-4 py-2 text-small font-bold text-on-brand focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[60]"
          >
            تخطي إلى المحتوى
          </a>
          <Header />
          <main id="main" className="w-full flex-1">
            {children}
          </main>
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
