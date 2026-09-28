"use client";

import React from "react";
import { Scale, CheckCircle2, ShieldCheck, Database, ExternalLink, Sparkles } from "lucide-react";

export default function AboutCredentials() {
  const sources = [
    {
      domain: "القرآن الكريم والتفاسير المعتمدة",
      provider: "مصحف مجمع الملك فهد لطباعة المصحف الشريف",
      url: "https://quranpedia.net",
      desc: "نصوص الآيات القرآنية الكريمة بالرسم العثماني المعتمد مع تفاسير القرون الثلاثة الأولى وتفسير السعدي والميسر.",
    },
    {
      domain: "السنة النبوية والأحاديث الصحيحة",
      provider: "الموسوعة الحديثية - مؤسسة الدرر السنية",
      url: "https://dorar.net/hadith",
      desc: "أحاديث الصحيحين وما صححه جهابذة المحدثين، مع منع تام لأي حديث ضعيف أو موضوع أو لا أصل له.",
    },
    {
      domain: "المفردات والتوطين الثقافي",
      provider: "موسوعة الجمهرة لمفردات المحتوى الإسلامي",
      url: "https://islamic-content.com/dictionary",
      desc: "الترجمات المعتمدة للمصطلحات الشرعية الحساسة باللغات العالمية منعاً للترجمات الاستشراقية المشوهة.",
    },
    {
      domain: "الشبهات والأسئلة الحوارية",
      provider: "المستودع الدعوي الرقمي (بينات - ملف 7937)",
      url: "https://dawa.center",
      desc: "قواعد تفكيك الشبهات بالحكمة والمنطق الإنساني الهادئ دون تشنج أو عدائية.",
    },
  ];

  return (
    <div className="w-full space-y-6 animate-in fade-in-50 duration-500">
      
      {/* بطاقة التوثيق الرسمية */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#12183F] via-[#1a2254] to-[#12183F] border border-[#6150EA]/40">
        <div className="flex items-center gap-2 mb-2">
          <Scale className="w-5 h-5 text-[#2EF2C2]" />
          <span className="text-xs font-bold text-[#2EF2C2] uppercase tracking-wider">
            المطابقة المؤسسية والشرعية
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#F2F4FF]">
          المرجعية والحزمة العلمية المعتمدة في التحدي
        </h2>
        <p className="text-xs sm:text-sm text-[#9FA9D8] mt-2 leading-relaxed max-w-3xl">
          تم بناء نظام «قيم مضيئة AI» التزاماً حرفياً بوثيقة «المرجعية والحزمة العلمية والبيانات» الصادرة عن تحدي الذكاء الاصطناعي في خدمة المحتوى الإسلامي 2026م (برعاية مؤسسة باذل الأهلية وسدايا ووزارة الاتصالات).
        </p>
      </div>

      {/* مصفوفة المصادر المعتمدة الأربعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((src, i) => (
          <div key={i} className="p-5 rounded-2xl glass-panel border border-[#6150EA]/25 hover:border-[#2EF2C2]/40 transition-all">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-[#2EF2C2]">{src.domain}</span>
              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#9FA9D8] hover:text-[#2EF2C2] flex items-center gap-1 transition-colors"
              >
                <span>زيارة المرجع</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <h3 className="text-sm font-bold text-[#F2F4FF] mb-1.5">{src.provider}</h3>
            <p className="text-xs text-[#9FA9D8] leading-relaxed font-light">{src.desc}</p>
          </div>
        ))}
      </div>

      {/* مستويات المحتوى الأربعة وضبط الاستجابة */}
      <div className="p-6 rounded-2xl glass-panel border border-[#6150EA]/20 space-y-3">
        <h3 className="text-sm font-bold text-[#F2F4FF] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#2EF2C2]" />
          مستويات ضبط الاستجابة الأربعة في النظام:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-[#0a0d24]/60 border border-[#6150EA]/20">
            <span className="text-xs font-bold text-[#2EF2C2] block">المستوى (أ)</span>
            <span className="text-xs font-semibold text-[#F2F4FF] block mt-0.5">معلومات مستقرة</span>
            <p className="text-[11px] text-[#9FA9D8] mt-1">إجابة مباشرة موثقة بالسند الصحيح (قرآن وحديث).</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#0a0d24]/60 border border-[#6150EA]/20">
            <span className="text-xs font-bold text-[#6150EA] block">المستوى (ب)</span>
            <span className="text-xs font-semibold text-[#F2F4FF] block mt-0.5">شرح واستدلال</span>
            <p className="text-[11px] text-[#9FA9D8] mt-1">استناد للمعتمد وتجنب القطع فيما يحتمل الخلاف.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#0a0d24]/60 border border-amber-500/30">
            <span className="text-xs font-bold text-amber-400 block">المستوى (ج)</span>
            <span className="text-xs font-semibold text-[#F2F4FF] block mt-0.5">مسائل خلافية</span>
            <p className="text-[11px] text-[#9FA9D8] mt-1">تقييد بالمعتمد أو بيان الخلاف والإحالة للمختصين.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#0a0d24]/60 border border-rose-500/30">
            <span className="text-xs font-bold text-rose-400 block">المستوى (د)</span>
            <span className="text-xs font-semibold text-[#F2F4FF] block mt-0.5">فتوى أو حالة خاصة</span>
            <p className="text-[11px] text-[#9FA9D8] mt-1">امتناع فوري وإحالة للجهات الرسمية المعتمدة.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
