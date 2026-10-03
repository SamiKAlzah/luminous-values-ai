"use client";

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import ValuesSelector from "../components/ValuesSelector";
import EnvironmentSelector from "../components/EnvironmentSelector";
import ExperienceCard from "../components/ExperienceCard";
import GuardrailAlert from "../components/GuardrailAlert";
import JudgesConsole from "../components/JudgesConsole";
import AboutCredentials from "../components/AboutCredentials";
import { VALUES_DATA, ENVIRONMENTS, Scenario } from "../data/localDatasets";
import { 
  Sparkles, 
  Send, 
  ShieldCheck, 
  Compass, 
  RotateCcw, 
  AlertTriangle,
  HeartHandshake,
  CheckCircle2,
  Info
} from "lucide-react";

export default function Home() {
  const [currentTab, setCurrentTab] = useState<"experience" | "judges" | "about">("experience");
  const [language, setLanguage] = useState("ar");
  const [selectedValue, setSelectedValue] = useState("citizenship");
  const [selectedEnvironment, setSelectedEnvironment] = useState("home");
  const [customQuery, setCustomQuery] = useState("");
  const [loading, setLoading] = useState(false);
  
  // نتائج العرض
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [blockedResult, setBlockedResult] = useState<{
    level: string;
    action: string;
    responseText: string;
    justification?: string;
  } | null>(null);

  // اللغة والاتجاه: العربية والأردية من اليمين إلى اليسار، والبقية من اليسار إلى اليمين
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" || language === "ur" ? "rtl" : "ltr";
  }, [language]);

  // تحديث السيناريو الافتراضي عند تغيير القيمة أو البيئة
  useEffect(() => {
    updateScenarioLocally(selectedValue, selectedEnvironment);
  }, [selectedValue, selectedEnvironment]);

  const updateScenarioLocally = (valId: string, envId: string) => {
    setBlockedResult(null);
    const val = VALUES_DATA[valId];
    if (val) {
      const scen = val.scenarios.find((s) => s.environment === envId) || val.scenarios[0];
      setCurrentScenario(scen);
    }
  };

  // إرسال الطلب والتوليد (يدعم خادم FastAPI مع تبديل فوري للاحتياطي المحلي)
  const handleGenerate = async (overrideQuery?: string) => {
    const queryToUse = overrideQuery !== undefined ? overrideQuery : customQuery;
    setLoading(true);
    setBlockedResult(null);

    try {
      // 1. محاولة الاتصال بخادم الـ Backend عبر منفذ 8000
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch("http://localhost:8000/api/scenarios/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value_id: selectedValue,
          environment: selectedEnvironment,
          user_query: queryToUse || undefined,
          language: language,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.status === "blocked") {
          setBlockedResult({
            level: data.level,
            action: data.action,
            responseText: data.response_text,
            justification: data.justification,
          });
          setLoading(false);
          return;
        } else if (data.status === "success" && data.card) {
          const card = data.card;
          setCurrentScenario({
            environment: card.environment,
            title: card.behavior_title,
            observable_situation: card.observable_situation,
            actionable_steps: card.actionable_steps,
            islamic_ground_truth: card.islamic_ground_truth,
          });
          setLoading(false);
          return;
        }
      }
    } catch {
      // في حال لم يكن خادم FastAPI قيد التشغيل، نقوم بالفحص المحلي الفوري
    }

    // 2. الفحص والتقييم المحلي (Client-side Resilience Engine)
    if (queryToUse && queryToUse.trim()) {
      const q = queryToUse.toLowerCase();

      // فحص الحالات الحرجة للـ Guardrails محلياً
      if (
        q.includes("طلاق") || 
        q.includes("خلع") || 
        q.includes("ناشز") || 
        q.includes("نفقة") || 
        q.includes("صدم سيارتي") || 
        q.includes("التنازل عن حقي") || 
        q.includes("ميراثي") || 
        q.includes("جمع تبرعات") || 
        q.includes("خصم من زكاة") || 
        q.includes("تهرب من دفع")
      ) {
        setBlockedResult({
          level: "level_d",
          action: "refuse_and_refer",
          responseText:
            "عذراً، يختص نظام «قيم مضيئة AI» بالتوجيه القيمي والأخلاقي العام، ولا يصدر فتاوى شرعية خاصة أو يقضي في النزاعات الجنائية والأسرية والمالية. نوصيك بمراجعة دار الإفتاء الرسمية والمحاكم الشرعية المختصة لتقدير واقعتك الخاصة.",
          justification:
            "الالتزام الصارم بالصفحة 2 و5 من الحزمة العلمية للتحدي: منع الاستقلال بالفتوى أو معالجة النزاعات الخاصة وبناء أحكام على وقائع فردية.",
        });
        setLoading(false);
        return;
      }

      if (
        q.includes("سياسات الدولة") || 
        q.includes("الحروب الإقليمية") || 
        q.includes("النزاعات العسكرية") || 
        q.includes("حكم في الحاكم") || 
        q.includes("المعتدي الباغي")
      ) {
        setBlockedResult({
          level: "level_c",
          action: "refuse_and_refer",
          responseText:
            "عذراً، يركز نظامنا على الهدي السلوكي الفردي والتربوي، ولا يخوض إطلاقاً في القضايا الفكرية والسياسية الشائكة أو النزاعات العسكرية والدولية. ونحيل في ذلك لمواقف هيئات كبار العلماء والمجامع المعتمدة.",
          justification:
            "الالتزام بالصفحة 2 من الحزمة العلمية: استبعاد القضايا الفكرية والسياسية الجدلية التي تتطلب تحريراً سيادياً.",
        });
        setLoading(false);
        return;
      }

      if (
        q.includes("حب الوطن من الإيمان") || 
        q.includes("المسامح كريم") || 
        q.includes("اختلاف أمتي رحمة") || 
        q.includes("قصرا من الزمرد")
      ) {
        setBlockedResult({
          level: "anti_hallucination",
          action: "clarify_and_correct",
          responseText:
            "تنبيه علمي لمقاومة الهلوسة: العبارة المذكورة حكمة أو مقولة دارجة على الألسنة، وليست حديثاً نبوياً ثابتاً عن النبي ﷺ (بل حكم المحدثون بأنها موضوعة أو لا أصل لها). والواجب شرعاً نسبة الأحاديث الصحيحة الثابتة في دواوين السنة كالصحيحين وموسوعة الدرر السنية.",
          justification:
            "الالتزام بصفحة 3 و6 من الحزمة العلمية: مقاومة الهلوسة، ورفض اختالق أو نسبة حديث لم يثبت، وإيراد السند الصحيح من الدرر السنية.",
        });
        setLoading(false);
        return;
      }
    }

    // استرجاع الموقف المعتمد للقيمة والبيئة
    updateScenarioLocally(selectedValue, selectedEnvironment);
    setLoading(false);
  };

  const currentValData = VALUES_DATA[selectedValue] || VALUES_DATA.citizenship;
  const currentEnvData = ENVIRONMENTS.find((e) => e.id === selectedEnvironment) || ENVIRONMENTS[0];

  return (
    <div className="flex-1 flex flex-col justify-between">
      {/* الترويسة الرئيسية */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        language={language}
        onLanguageChange={setLanguage}
      />

      {/* المحتوى الرئيسي */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* تبويب التجربة التفاعلية */}
        {currentTab === "experience" && (
          <div className="space-y-8">
            
            {/* بطاقة الترحيب والفطرة (Hero Section) */}
            <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 glass-panel border border-[#6150EA]/30 bg-gradient-to-br from-[#12183F]/90 via-[#12183F]/60 to-[#1a2254]/80 shadow-[0_10px_40px_rgba(97,80,234,0.15)]">
              <div className="absolute top-0 left-0 w-80 h-80 bg-[#6150EA]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#2EF2C2]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#6150EA]/25 text-[#2EF2C2] border border-[#2EF2C2]/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>تحدي الذكاء الاصطناعي في خدمة المحتوى الإسلامي 2026م</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-[#F2F4FF] tracking-tight leading-tight">
                  قيم مضيئة: <span className="bg-gradient-to-r from-[#2EF2C2] via-[#F2F4FF] to-[#6150EA] bg-clip-text text-transparent">من الكلمة إلى الأثر، ومن الفطرة إلى السلوك</span>
                </h1>

                <p className="text-xs sm:text-sm text-[#9FA9D8] leading-relaxed font-light">
                  تجربة تفاعلية ذكية تُعيد بناء العلاقة مع القيم الإسلامية؛ تبدأ بمخاطبة الوجدان الإنساني بـ <strong>قاموس الفطرة</strong>، وتترجم القيمة إلى <strong>سلوك واقعي مشاهد</strong>، وتؤصل الموقف بـ <strong>سند شرعي قطعي مع روابط تدقيق فورية</strong> في مجمع الملك فهد والدرر السنية.
                </p>
              </div>
            </div>

            {/* منطقة الاختيار التفاعلي: القيم والبيئات */}
            <div className="space-y-6">
              <ValuesSelector
                selectedValue={selectedValue}
                onSelectValue={(id) => setSelectedValue(id)}
                language={language}
              />

              <EnvironmentSelector
                selectedEnvironment={selectedEnvironment}
                onSelectEnvironment={(id) => setSelectedEnvironment(id)}
                language={language}
              />
            </div>

            {/* شريط الاستفسار المخصص والمحاكاة */}
            <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-[#6150EA]/25 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#F2F4FF] flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#2EF2C2]" />
                  <span>هل لديك موقف معين تريد اختباره في هذا السياق؟ (اختياري)</span>
                </label>
                <span className="text-[11px] text-[#9FA9D8] font-light">
                  يمكنك أيضاً تجربة أسئلة الاستدراج لاختبار جدار الأمان
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder="مثال: كيف أتعامل برقي مع زميل أساء إلي في العمل؟"
                  className="flex-1 bg-[#0a0d24]/80 border border-[#6150EA]/30 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#F2F4FF] placeholder-[#9FA9D8]/50 focus:outline-none focus:border-[#2EF2C2] focus:ring-1 focus:ring-[#2EF2C2]/50 transition-all"
                />

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleGenerate()}
                    disabled={loading}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#2EF2C2] to-[#4af5cd] text-[#12183F] shadow-[0_4px_20px_rgba(46,242,194,0.35)] hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-[#12183F] border-t-transparent rounded-full animate-spin" />
                        <span>جاري التحقق والتأصيل...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 rotate-180" />
                        <span>توليد بطاقة الموقف</span>
                      </>
                    )}
                  </button>

                  {customQuery && (
                    <button
                      onClick={() => {
                        setCustomQuery("");
                        updateScenarioLocally(selectedValue, selectedEnvironment);
                      }}
                      className="p-2.5 rounded-xl bg-[#12183F] border border-[#6150EA]/30 text-[#9FA9D8] hover:text-[#F2F4FF] transition-colors"
                      title="إعادة ضبط"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* شاشة عرض النتيجة أو الاعتراض الشرعي */}
            <div className="pt-2">
              {blockedResult ? (
                <GuardrailAlert
                  level={blockedResult.level}
                  action={blockedResult.action}
                  responseText={blockedResult.responseText}
                  justification={blockedResult.justification}
                />
              ) : currentScenario ? (
                <ExperienceCard
                  scenario={currentScenario}
                  fitrahKey={currentValData.fitrah_key[language] || currentValData.fitrah_key["ar"]}
                  valueName={currentValData.value_name[language] || currentValData.value_name["ar"]}
                  environmentName={language === "ar" ? currentEnvData.name_ar : currentEnvData.name_en}
                />
              ) : null}
            </div>

          </div>
        )}

        {/* تبويب منصة فحص التحكيم */}
        {currentTab === "judges" && (
          <JudgesConsole
            onRunTest={(testQuery) => {
              setCustomQuery(testQuery);
              setCurrentTab("experience");
              handleGenerate(testQuery);
            }}
          />
        )}

        {/* تبويب الحزمة العلمية والاعتمادات */}
        {currentTab === "about" && <AboutCredentials />}

      </main>

      {/* التذييل المؤسسي */}
      <footer className="w-full glass-panel border-t border-[#6150EA]/20 bg-[#0a0d24]/90 py-6 mt-12 text-xs text-[#9FA9D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#F2F4FF]">قيم مضيئة AI</span>
            <span>• تحدي الذكاء الاصطناعي في خدمة المحتوى الإسلامي 2026م</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <span>مؤسسة باذل الأهلية</span>
            <span>•</span>
            <span>الهيئة السعودية للبيانات والذكاء الاصطناعي (SDAIA)</span>
            <span>•</span>
            <span>وزارة الاتصالات وتقنية المعلومات</span>
          </div>

          <div className="text-[11px] text-[#2EF2C2] font-medium">
            مرخص تحت رخصة MIT مفتوحة المصدر
          </div>
        </div>
      </footer>
    </div>
  );
}
