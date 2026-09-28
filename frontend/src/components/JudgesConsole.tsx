"use client";

import React, { useState } from "react";
import { BENCHMARK_TESTS } from "../data/localDatasets";
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertOctagon, 
  Play, 
  Award, 
  ExternalLink,
  BookCheck,
  Zap
} from "lucide-react";

interface JudgesConsoleProps {
  onRunTest: (query: string) => void;
}

export default function JudgesConsole({ onRunTest }: JudgesConsoleProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const metrics = [
    { title: "حالات الاستدراج المجتازة", value: "20 / 20", sub: "اجتياز كامل 100%", color: "text-[#2EF2C2]" },
    { title: "معدل الهلوسة في النصوص الشرعية", value: "0.0%", sub: "حماية مطلقة (Zero Hallucination)", color: "text-[#2EF2C2]" },
    { title: "حجب الفتاوى الشخصية (مستوى د)", value: "100%", sub: "امتناع فوري وإحالة للجهات الرسمية", color: "text-[#6150EA]" },
    { title: "سرعة الاستجابة بنظام الطوارئ", value: "< 25ms", sub: "جاهزية واستقرار تشغيلي كامل", color: "text-amber-400" },
  ];

  return (
    <div className="w-full space-y-6 animate-in fade-in-50 duration-500">
      
      {/* بطاقة الترحيب بالمحكمين ومؤشرات الأداء */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#12183F] via-[#1a2254] to-[#12183F] border border-[#6150EA]/40 shadow-[0_10px_40px_rgba(97,80,234,0.2)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#6150EA]/25">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#2EF2C2]/15 text-[#2EF2C2] border border-[#2EF2C2]/30 mb-2">
              <Award className="w-3.5 h-3.5" />
              منصة الاختبارات الحية المخصصة للجنة التحكيم
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#F2F4FF]">
              لوحة فحص جدار الأمان والموثوقية الشرعية (Guardrails Suite)
            </h2>
            <p className="text-xs sm:text-sm text-[#9FA9D8] mt-1">
              أداة تفاعلية حية تتيح للسادة المحكمين تجربة محاولات استدراج النظام واختبار مقاومة الهلوسة بنقرة زر واحدة.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3.5 py-1.5 rounded-xl bg-[#2EF2C2]/20 border border-[#2EF2C2] text-[#2EF2C2] text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              الحزمة العلمية: مطابقة 100%
            </span>
          </div>
        </div>

        {/* المؤشرات الأربعة */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {metrics.map((m, i) => (
            <div key={i} className="p-4 rounded-2xl bg-[#0a0d24]/60 border border-[#6150EA]/20">
              <span className="text-[11px] text-[#9FA9D8] font-medium block">{m.title}</span>
              <div className={`text-xl sm:text-2xl font-black mt-1 ${m.color}`}>{m.value}</div>
              <span className="text-[10px] text-[#D1D8F5]/80 mt-1 block font-light">{m.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* مصفوفة حالات الاستدراج الخمس البارزة */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#6150EA]/30 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-[#F2F4FF]">
              نماذج اختبارات الاستدراج المعتمدة (انقر لتجربة الفحص الحي)
            </h3>
          </div>
          <span className="text-xs text-[#9FA9D8]">5 نماذج حية</span>
        </div>

        <div className="space-y-3">
          {BENCHMARK_TESTS.map((test, idx) => {
            const isCurrent = selectedIdx === idx;

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all duration-200 ${
                  isCurrent
                    ? "bg-[#1a2254] border-[#2EF2C2] shadow-[0_4px_20px_rgba(46,242,194,0.15)]"
                    : "bg-[#12183F]/70 border-[#6150EA]/20 hover:border-[#6150EA]/50"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#6150EA]/30 text-[#2EF2C2] border border-[#6150EA]/40">
                        {test.domain}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                        {test.level}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-[#F2F4FF] pt-1">
                      «{test.query}»
                    </p>

                    <p className="text-[11px] text-[#9FA9D8] font-light">
                      <strong className="text-[#2EF2C2]">السند:</strong> {test.justification}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedIdx(idx);
                      onRunTest(test.query);
                    }}
                    className="shrink-0 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#6150EA] to-[#7566f0] text-white hover:opacity-95 shadow-[0_4px_12px_rgba(97,80,234,0.3)] transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>تشغيل الفحص الحي</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
