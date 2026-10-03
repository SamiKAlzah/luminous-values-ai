"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "../components/LanguageProvider";
import ValuesSelector from "../components/ValuesSelector";
import EnvironmentSelector from "../components/EnvironmentSelector";
import ExperienceCard from "../components/ExperienceCard";
import GuardrailNotice from "../components/GuardrailNotice";
import { VALUES_DATA, ENVIRONMENTS, BENCHMARK_TESTS, Scenario } from "../data/localDatasets";
import { RotateCcw, Send } from "lucide-react";
import Button, { buttonClasses } from "../components/Button";
import AudioToggle from "../components/AudioToggle";
import { HeroArch, OrnamentBand, OrnamentDivider } from "../components/Ornament";

function HomeContent() {
  const { language } = useLanguage();
  const [selectedValue, setSelectedValue] = useState("citizenship");
  const [selectedEnvironment, setSelectedEnvironment] = useState("home");
  const [customQuery, setCustomQuery] = useState("");
  const [loading, setLoading] = useState(false);
  
  // نتائج العرض: السيناريو المولَّد من الخادم، وإلا فالسيناريو المعتمد للقيمة والبيئة
  const [generatedScenario, setGeneratedScenario] = useState<Scenario | null>(null);
  const [blockedResult, setBlockedResult] = useState<{
    level: string;
    action: string;
    responseText: string;
    justification?: string;
  } | null>(null);

  // العودة إلى الموقف المعتمد للقيمة والبيئة المختارتين
  const resetResults = () => {
    setBlockedResult(null);
    setGeneratedScenario(null);
  };

  const valueForScenario = VALUES_DATA[selectedValue] || VALUES_DATA.citizenship;
  const defaultScenario =
    valueForScenario.scenarios.find((s) => s.environment === selectedEnvironment) ||
    valueForScenario.scenarios[0];
  const currentScenario = generatedScenario ?? defaultScenario;

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
          setGeneratedScenario({
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
    setGeneratedScenario(null);
    setLoading(false);
  };

  // الفحص الحي القادم من صفحة «حول المنصة والتحقق»
  const testParam = useSearchParams().get("test");
  useEffect(() => {
    if (testParam === null) return;
    const test = BENCHMARK_TESTS[Number(testParam)];
    if (!test) return;
    const timer = setTimeout(() => {
      setCustomQuery(test.query);
      handleGenerate(test.query);
    }, 0);
    return () => clearTimeout(timer);
    // يُشغَّل مرة لكل قيمة في الرابط
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testParam]);

  const currentValData = VALUES_DATA[selectedValue] || VALUES_DATA.citizenship;
  const currentEnvData = ENVIRONMENTS.find((e) => e.id === selectedEnvironment) || ENVIRONMENTS[0];

  return (
    <>
      <OrnamentBand height={48} />

      <div className="mx-auto w-full max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:space-y-16 lg:px-8">
        {/* 1. الترحيب: سطر واحد وزر واحد */}
        <section className="grid items-center gap-8 rounded-xl border border-line bg-surface-200 p-8 sm:p-12 md:grid-cols-[1fr_auto]">
          <div>
            <h1 className="text-h1 text-ink lg:text-display">قيم مضيئة</h1>
            <p className="mt-3 max-w-2xl text-body text-ink-muted">
              من الكلمة إلى الأثر، ومن الفطرة إلى السلوك: تجربة تحوّل القيم الإسلامية إلى سلوك ملاحظ
              مؤصَّل بسند شرعي يمكنك التحقق منه.
            </p>
            <a href="#values" className={buttonClasses("primary", "mt-6")}>
              ابدأ الرحلة
            </a>
          </div>
          <HeroArch className="hidden h-56 w-auto md:block" groundClassName="fill-surface-200" />
        </section>

        {/* 2. اختر القيمة  3. اختر الموضع */}
        <div className="space-y-12">
          <div id="values" className="scroll-mt-24">
            <ValuesSelector
              selectedValue={selectedValue}
              onSelectValue={(id) => {
                setSelectedValue(id);
                resetResults();
              }}
              language={language}
            />
          </div>

          <EnvironmentSelector
            selectedEnvironment={selectedEnvironment}
            onSelectEnvironment={(id) => {
              setSelectedEnvironment(id);
              resetResults();
            }}
            language={language}
          />
        </div>

        {/* موقف مخصص واختبار جدار الأمان (اختياري) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate();
          }}
          className="space-y-3 rounded-lg border border-line bg-surface-card p-6 shadow-sm"
        >
          <label htmlFor="custom-query" className="block text-body font-semibold text-ink">
            هل لديك موقف معين تريد اختباره في هذا السياق؟ (اختياري)
          </label>
          <p className="text-small text-ink-muted">
            يمكنك أيضاً تجربة أسئلة الاستدراج لاختبار جدار الأمان.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="custom-query"
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="مثال: كيف أتعامل برقي مع زميل أساء إلي في العمل؟"
              className="min-h-11 flex-1 rounded-md border border-line bg-surface-100 px-4 text-body text-ink placeholder:text-ink-muted"
            />
            <div className="flex items-center gap-2">
              <Button type="submit" disabled={loading} className="flex-1 sm:flex-initial">
                {loading ? (
                  <>
                    <span
                      className="h-4 w-4 animate-spin rounded-pill border-2 border-on-brand border-t-transparent"
                      aria-hidden="true"
                    />
                    <span>جاري التحقق والتأصيل...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 rtl:-scale-x-100" strokeWidth={1.5} aria-hidden="true" />
                    <span>توليد بطاقة الموقف</span>
                  </>
                )}
              </Button>
              {customQuery && (
                <Button
                  variant="quiet"
                  aria-label="إعادة ضبط"
                  title="إعادة ضبط"
                  onClick={() => {
                    setCustomQuery("");
                    resetResults();
                  }}
                >
                  <RotateCcw className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                </Button>
              )}
            </div>
          </div>
        </form>

        <OrnamentDivider />

        {/* 4. التجربة: الخطوة السلوكية ثم السند الشرعي ثم المصادر، أو إحالة جدار الأمان */}
        <section aria-label="التجربة" aria-live="polite">
          {blockedResult ? (
            <GuardrailNotice
              level={blockedResult.level}
              responseText={blockedResult.responseText}
              justification={blockedResult.justification}
            />
          ) : (
            <ExperienceCard
              scenario={currentScenario}
              fitrahKey={currentValData.fitrah_key[language] || currentValData.fitrah_key["ar"]}
              valueName={currentValData.value_name[language] || currentValData.value_name["ar"]}
              environmentName={language === "ar" ? currentEnvData.name_ar : currentEnvData.name_en}
            />
          )}
        </section>

        {/* 5. التأمل: سؤال ختامي قصير والسكينة الصوتية الاختيارية */}
        <section
          aria-labelledby="reflection-heading"
          className="flex flex-col items-start justify-between gap-6 rounded-xl bg-surface-deep p-8 text-ink-on-deep sm:flex-row sm:items-center sm:p-12"
        >
          <div>
            <h2 id="reflection-heading" className="text-h2">
              لحظة تأمل
            </h2>
            <p className="mt-2 max-w-xl text-body">
              ما الخطوة الواحدة الصغيرة التي ستبدأ بها اليوم؟ يمكنك أن ترافقك السكينة الصوتية أثناء التفكير.
            </p>
          </div>
          <AudioToggle />
        </section>
      </div>
    </>
  );
}

// يشغّل الفحص الحي القادم من صفحة «حول المنصة والتحقق» عبر /?test=<رقم>
export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
