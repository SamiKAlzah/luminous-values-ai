"use client";

import React from "react";
import { ShieldAlert, AlertTriangle, ArrowUpRight, Scale, BookOpenCheck } from "lucide-react";

interface GuardrailAlertProps {
  level: string;
  action: string;
  responseText: string;
  justification?: string;
  triggerType?: string;
}

export default function GuardrailAlert({
  level,
  action,
  responseText,
  justification,
  triggerType,
}: GuardrailAlertProps) {
  const getLevelBadge = (lvl: string) => {
    switch (lvl) {
      case "level_d":
        return {
          title: "المستوى (د): فتوى أو حالة خاصة أو نزاع فردي",
          color: "bg-rose-500/20 text-rose-300 border-rose-500/40",
          icon: <ShieldAlert className="w-4 h-4 text-rose-400" />
        };
      case "level_c":
        return {
          title: "المستوى (ج): مسائل خلافية أو قضايا فكرية شائكة",
          color: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          icon: <Scale className="w-4 h-4 text-amber-400" />
        };
      case "anti_hallucination":
        return {
          title: "مقاومة الهلوسة (Anti-Hallucination): تصحيح حديث غير ثابت",
          color: "bg-purple-500/20 text-purple-300 border-purple-500/40",
          icon: <BookOpenCheck className="w-4 h-4 text-purple-400" />
        };
      default:
        return {
          title: "حماية شرعية معتمدة",
          color: "bg-rose-500/20 text-rose-300 border-rose-500/40",
          icon: <AlertTriangle className="w-4 h-4 text-rose-400" />
        };
    }
  };

  const badge = getLevelBadge(level);

  return (
    <div className="w-full guardrail-blocked-card rounded-2xl p-6 border space-y-4 animate-in fade-in-50 zoom-in-95 duration-400">
      
      {/* الترويسة وشارة المستوى */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-500/20 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300">
            {badge.icon}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
              جدار الأمان الشرعي (First-pass Guardrail)
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-[#F2F4FF]">
              امتناع وإحالة وفق ضوابط الحزمة العلمية
            </h3>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${badge.color}`}>
          {badge.title}
        </span>
      </div>

      {/* الرد الشرعي المعتمد والمحرر */}
      <div className="p-4 rounded-xl bg-[#0a0d24]/80 border border-rose-500/30 text-xs sm:text-sm text-[#F2F4FF] leading-relaxed shadow-inner">
        <p className="font-medium text-rose-100">
          {responseText}
        </p>
      </div>

      {/* التبرير والسند من وثيقة المرجعية الرسمية للتحدي */}
      {justification && (
        <div className="p-3 rounded-lg bg-[#12183F]/70 border border-[#6150EA]/30 text-xs text-[#9FA9D8] flex items-start gap-2">
          <Scale className="w-4 h-4 text-[#2EF2C2] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#2EF2C2] ml-1">السند والضابط المعتمد:</span>
            {justification}
          </div>
        </div>
      )}

      {/* روابط الإحالة الرسمية */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-rose-500/20 text-xs text-[#9FA9D8]">
        <span>نطاق النظام: التوجيه القيمي والسلوكي العام فقط (لا يفتي ولا يقضي في الخصومات)</span>
        <a
          href="https://www.alifta.gov.sa"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/20 text-rose-200 border border-rose-500/30 hover:bg-rose-500/30 transition-colors"
        >
          <span>بوابة الإفتاء الرسمية المعتمدة</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
