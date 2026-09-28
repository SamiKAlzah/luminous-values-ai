"use client";

import React from "react";
import AudioPlayer from "./AudioPlayer";
import { ShieldCheck, Compass, Scale, Globe2 } from "lucide-react";

interface HeaderProps {
  currentTab: "experience" | "judges" | "about";
  onTabChange: (tab: "experience" | "judges" | "about") => void;
  language: string;
  onLanguageChange: (lang: string) => void;
}

export default function Header({
  currentTab,
  onTabChange,
  language,
  onLanguageChange,
}: HeaderProps) {
  const languages = [
    { code: "ar", label: "العربية" },
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
    { code: "ur", label: "اردو" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-[#6150EA]/25 bg-[#0a0d24]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* هوية المشروع والشعار */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6150EA] via-[#12183F] to-[#2EF2C2] p-[1.5px] shadow-[0_0_20px_rgba(97,80,234,0.35)]">
              <div className="w-full h-full bg-[#12183F] rounded-[14px] flex items-center justify-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-[#2EF2C2] to-[#F2F4FF] bg-clip-text text-transparent">
                  ق
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#F2F4FF]">
                  قيم مضيئة <span className="text-[#2EF2C2] text-sm font-semibold tracking-wider">AI</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#6150EA]/25 text-[#2EF2C2] border border-[#2EF2C2]/30">
                  المسار 03
                </span>
              </div>
              <p className="text-xs text-[#9FA9D8] tracking-normal font-light hidden sm:block">
                «تهدي الروح إلى هدوئها، وترتقي بالسلوك إلى غايته»
              </p>
            </div>
          </div>

          {/* أزرار التبويب الرئيسية */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-[#12183F]/70 border border-[#6150EA]/20">
            <button
              onClick={() => onTabChange("experience")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                currentTab === "experience"
                  ? "bg-[#6150EA] text-[#F2F4FF] shadow-[0_4px_15px_rgba(97,80,234,0.4)]"
                  : "text-[#9FA9D8] hover:text-[#F2F4FF] hover:bg-[#1a2254]/50"
              }`}
            >
              <Compass className="w-4 h-4 text-[#2EF2C2]" />
              التجربة التفاعلية
            </button>
            <button
              onClick={() => onTabChange("judges")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                currentTab === "judges"
                  ? "bg-[#6150EA] text-[#F2F4FF] shadow-[0_4px_15px_rgba(97,80,234,0.4)]"
                  : "text-[#9FA9D8] hover:text-[#F2F4FF] hover:bg-[#1a2254]/50"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#2EF2C2]" />
              منصة فحص التحكيم (Guardrails)
            </button>
            <button
              onClick={() => onTabChange("about")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                currentTab === "about"
                  ? "bg-[#6150EA] text-[#F2F4FF] shadow-[0_4px_15px_rgba(97,80,234,0.4)]"
                  : "text-[#9FA9D8] hover:text-[#F2F4FF] hover:bg-[#1a2254]/50"
              }`}
            >
              <Scale className="w-4 h-4 text-[#2EF2C2]" />
              الحزمة العلمية والمعايير
            </button>
          </nav>

          {/* الطرف الأيسر: مشغل الصوت ومحول اللغات */}
          <div className="flex items-center gap-2.5">
            {/* مشغل السكينة الصوتية */}
            <AudioPlayer />

            {/* محول اللغات */}
            <div className="relative flex items-center gap-1 bg-[#12183F]/80 border border-[#6150EA]/30 px-2.5 py-1.5 rounded-full text-xs text-[#F2F4FF]">
              <Globe2 className="w-3.5 h-3.5 text-[#2EF2C2]" />
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="bg-transparent text-xs font-medium text-[#F2F4FF] focus:outline-none cursor-pointer pr-1"
                aria-label="اختيار لغة العرض"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code} className="bg-[#12183F] text-[#F2F4FF]">
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* شريط تبويبات الجوال */}
      <div className="flex md:hidden border-t border-[#6150EA]/20 px-3 py-2 bg-[#0a0d24]/90 justify-around">
        <button
          onClick={() => onTabChange("experience")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
            currentTab === "experience" ? "bg-[#6150EA] text-white" : "text-[#9FA9D8]"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          التجربة
        </button>
        <button
          onClick={() => onTabChange("judges")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
            currentTab === "judges" ? "bg-[#6150EA] text-white" : "text-[#9FA9D8]"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          فحص التحكيم
        </button>
        <button
          onClick={() => onTabChange("about")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
            currentTab === "about" ? "bg-[#6150EA] text-white" : "text-[#9FA9D8]"
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          المعايير
        </button>
      </div>
    </header>
  );
}
