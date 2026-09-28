"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  BookOpen, 
  ExternalLink, 
  CheckCircle, 
  Copy, 
  Check, 
  Share2, 
  ShieldCheck, 
  Bookmark, 
  Quote
} from "lucide-react";
import { Scenario, IslamicGroundTruth } from "../data/localDatasets";

interface ExperienceCardProps {
  scenario: Scenario;
  fitrahKey: string;
  valueName: string;
  environmentName: string;
  isFallback?: boolean;
}

export default function ExperienceCard({
  scenario,
  fitrahKey,
  valueName,
  environmentName,
  isFallback = true,
}: ExperienceCardProps) {
  const [copied, setCopied] = useState(false);
  const gt = scenario.islamic_ground_truth;
  const isQuran = gt.source_type === "quran";

  const handleCopy = () => {
    const textToCopy = `🌟 ${valueName} | ${environmentName}\n\n«${fitrahKey}»\n\n📌 الموقف السلوكي: ${scenario.title}\n${scenario.observable_situation}\n\n✅ الخطوات الإجرائية:\n${scenario.actionable_steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n📖 السند الشرعي المعتمد:\n${gt.evidence_text}\nالمصدر: ${gt.reference_source}\nالتحقق: ${gt.verification_url}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full space-y-5 animate-in fade-in-50 duration-500">
      
      {/* 1. بطاقة نفحة الفطرة الإنسانية (Fitrah Key Card) */}
      <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-r from-[#12183F] via-[#1a2254] to-[#12183F] border border-[#6150EA]/40 shadow-[0_8px_30px_rgba(97,80,234,0.15)]">
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#6150EA]/15 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-start gap-3.5 relative z-10">
          <div className="p-2.5 rounded-xl bg-[#6150EA]/25 border border-[#2EF2C2]/30 text-[#2EF2C2] shrink-0 mt-0.5">
            <Quote className="w-5 h-5 rotate-180" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold tracking-wider text-[#2EF2C2] uppercase">
                بوابة الفطرة والوجدان
              </span>
              <span className="text-[10px] text-[#9FA9D8] px-2 py-0.5 rounded-full bg-[#12183F] border border-[#6150EA]/30">
                جسر تواصل حضاري
              </span>
            </div>
            <p className="text-sm sm:text-base font-semibold leading-relaxed text-[#F2F4FF] italic">
              «{fitrahKey}»
            </p>
          </div>
        </div>
      </div>

      {/* 2. الموقف السلوكي الملاحظ والخطوات الإجرائية (The Behavioral Action Card) */}
      <div className="rounded-2xl p-6 glass-panel border border-[#6150EA]/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#6150EA]/20 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#2EF2C2]">الموقف الواقعي المقترح</span>
              <span className="text-xs text-[#9FA9D8]">• {environmentName}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#F2F4FF] mt-0.5">
              {scenario.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#12183F] border border-[#2EF2C2]/40 text-[#2EF2C2]">
              <ShieldCheck className="w-3.5 h-3.5" />
              سلوك مقاس وملاحظ
            </span>
          </div>
        </div>

        {/* وصف الواقع المشاهد */}
        <div className="p-3.5 rounded-xl bg-[#0a0d24]/60 border border-[#6150EA]/15 text-xs sm:text-sm text-[#D1D8F5] leading-relaxed">
          <span className="font-bold text-[#F2F4FF] ml-1.5">الواقع الملاحظ:</span>
          {scenario.observable_situation}
        </div>

        {/* الخطوات الإجرائية */}
        <div className="space-y-2.5 pt-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#9FA9D8] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#2EF2C2]" />
            خطوات التطبيق الحضاري خطوة بخطوة:
          </h4>
          <div className="grid gap-2 sm:grid-cols-1">
            {scenario.actionable_steps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-[#12183F]/70 border border-[#6150EA]/20 hover:border-[#2EF2C2]/40 transition-colors"
              >
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#6150EA]/30 text-[#2EF2C2] text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs sm:text-sm text-[#F2F4FF] leading-relaxed">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. بطاقة التأصيل الشرعي المستقلة الصارمة (Strict Visual Separation - Islamic Ground Truth Card) */}
      {/* تم تصميم هذه البطاقة بعزل بصري تام وإطار زخرفي بارز وفق شرط الحزمة العلمية لضمان الموثوقية */}
      <div className="sacred-card rounded-2xl p-6 relative overflow-hidden">
        {/* خلفية جمالية خافتة */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#2EF2C2]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-[#2EF2C2]/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#2EF2C2]/15 text-[#2EF2C2] border border-[#2EF2C2]/30">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#2EF2C2] block">
                التأصيل الشرعي المعتمد (Zero-Hallucination Ground Truth)
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-[#F2F4FF]">
                {isQuran ? "آية كريمة من القرآن العظيم" : "حديث نبوي شريف ثابت"}
              </h4>
            </div>
          </div>

          {/* شارة التوثيق والرتبة */}
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#2EF2C2]/10 text-[#2EF2C2] border border-[#2EF2C2]/30 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-[#2EF2C2]" />
              {gt.authenticity_grade || (isQuran ? "قطعي الثبوت والدلالة" : "صحيح")}
            </span>
          </div>
        </div>

        {/* النص الشرعي بالخط القرآني / الأميري البارز */}
        <div className="my-5 p-5 rounded-xl bg-[#0a0d24]/80 border border-[#2EF2C2]/30 text-center shadow-inner">
          <p className="font-quran text-lg sm:text-2xl text-[#2EF2C2] leading-loose selection:bg-[#6150EA]">
            {gt.evidence_text}
          </p>
          <div className="mt-3 pt-3 border-t border-[#6150EA]/20 flex items-center justify-center gap-2 text-xs text-[#9FA9D8]">
            <Bookmark className="w-3.5 h-3.5 text-[#6150EA]" />
            <span>{gt.reference_source}</span>
          </div>
        </div>

        {/* الإضاءة البيانية والتفسيرية المعتمدة */}
        <div className="p-3.5 rounded-xl bg-[#12183F]/70 border border-[#6150EA]/20 mb-4 text-xs sm:text-sm text-[#D1D8F5] leading-relaxed">
          <span className="font-bold text-[#2EF2C2] ml-1.5">التوجيه والدلالة:</span>
          {gt.tafseer_insight}
        </div>

        {/* زر الفحص والتدقيق المباشر في المنصات المعتمدة */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <span className="text-[11px] text-[#9FA9D8] font-light">
            المصدر المعتمد: {isQuran ? "مصحف مجمع الملك فهد لطباعة المصحف الشريف" : "الموسوعة الحديثية - الدرر السنية"}
          </span>

          <a
            href={gt.verification_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#2EF2C2] to-[#4af5cd] text-[#12183F] shadow-[0_4px_15px_rgba(46,242,194,0.3)] hover:opacity-95 transition-all"
          >
            <span>فحص وتدقيق السند المباشر ({isQuran ? "Quranpedia" : "Dorar.net"})</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 4. شريط تصدير الأثر ومشاركة السكينة (Share Calmness) */}
      <div className="flex items-center justify-between p-4 rounded-xl glass-panel border border-[#6150EA]/20">
        <div className="flex items-center gap-2 text-xs text-[#9FA9D8]">
          <Share2 className="w-4 h-4 text-[#2EF2C2]" />
          <span>انشر الأثر وشارك السكينة في محيطك ومجتمعك</span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#6150EA]/30 text-[#2EF2C2] border border-[#6150EA]/40 hover:bg-[#6150EA] hover:text-white transition-all duration-200"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#2EF2C2]" />
              <span>تم النسخ بنجاح!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>نسخ بطاقة السكينة</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
