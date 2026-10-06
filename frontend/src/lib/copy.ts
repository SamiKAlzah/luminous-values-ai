import type { JourneyId, Lang } from "./types";

export interface UiCopy {
  siteName: string;
  tagline: string;
  skipLink: string;
  metaTitle: string;
  metaDescription: string;
  nav: { label: string; home: string; aboutUs: string; about: string };
  languageLabel: string;
  themeLabel: string;
  themes: { light: string; dark: string; emerald: string };
  footer: { line: string; partners: string; license: string; followProgram: string };
  social: { x: string; youtube: string; instagram: string };
  values: Record<JourneyId, string>;
  home: {
    title: string;
    lead: string;
    cardsTitle: string;
    cardsLead: string;
    openJourney: string;
  };
  router: {
    label: string;
    placeholder: string;
    submit: string;
    submitting: string;
    counter: string;
    aiNotice: string;
    privacy: string;
  };
  referral: { startOver: string; specialistTitle: string; safetyTitle: string };
  journey: {
    back: string;
    next: string;
    start: string;
    stepOf: string;
    progress: string;
    chooseOne: string;
    yourChoice: string;
    situation: string;
    effect: string;
    solution: string;
    newSituation: string;
    newFeedback: string;
    today: string;
    trustIntro: string;
    tryAnother: string;
    home: string;
  };
  trust: {
    quran: string;
    hadith: string;
    text: string;
    reference: string;
    grade: string;
    translation: string;
    explanation: string;
    explanationNote: string;
    verify: string;
    reviewed: string;
    notReviewed: string;
  };
  about: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    lead: string;
    howTitle: string;
    howSteps: string[];
    programTitle: string;
    programBody: string;
    aiTitle: string;
    aiPoints: string[];
    privacyTitle: string;
    privacyBody: string;
    approvalsTitle: string;
    approvalsLead: string;
    approved: string;
    status: string;
    draft: string;
    version: string;
    by: string;
    on: string;
    evalTitle: string;
    evalNone: string;
    evalLead: string;
    evalProvisional: string;
    model: string;
    promptHash: string;
    commit: string;
    runAt: string;
    runs: string;
    metric: string;
    keywordBaseline: string;
    haikuWithFloor: string;
    haikuNoFloor: string;
    metrics: Record<string, string>;
    floorTitle: string;
    floorSafety: string;
    floorWrong: string;
    latency: string;
    tokens: string;
    failuresTitle: string;
    failuresNone: string;
    statusTitle: string;
    statusAvailable: string;
    statusUnavailable: string;
    statusUnknown: string;
    deferredTitle: string;
    deferred: string[];
  };
  aboutUs: {
    metaTitle: string;
    metaDescription: string;
    title: string;
    intro: string;
    visionTitle: string;
    vision: string;
    missionTitle: string;
    mission: string;
    goalsTitle: string;
    goals: string[];
    programsTitle: string;
    programs: string;
  };
}

export const UI_COPY: Record<Lang, UiCopy> = {
  ar: {
    siteName: "قيم مضيئة",
    tagline: "تهدي الروح إلى هدوئها",
    skipLink: "تخطي إلى المحتوى",
    metaTitle: "قيم مضيئة | من القيمة إلى السلوك",
    metaDescription:
      "منصة تعليمية تحوّل القيم الإسلامية إلى سلوك في مواقف الحياة اليومية: اكتب موقفك فيوجّهك الذكاء الاصطناعي إلى رحلة مراجَعة تنتهي بنص موثَّق وخطوة عملية.",
    nav: { label: "التنقل الرئيسي", home: "الرحلة", aboutUs: "من نحن", about: "حول المنصة والتحقق" },
    languageLabel: "لغة العرض",
    themeLabel: "المظهر",
    themes: { light: "نجد", dark: "ليل", emerald: "زمرد" },
    footer: {
      line: "قيم مضيئة · تحدي الذكاء الاصطناعي في خدمة المحتوى الإسلامي 2026م",
      partners:
        "مؤسسة باذل الأهلية · الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا) · وزارة الاتصالات وتقنية المعلومات",
      license: "مرخص برخصة MIT مفتوحة المصدر",
      followProgram: "تابع برنامج «قيم تجمعنا»",
    },
    social: {
      x: "قيم تجمعنا على X",
      youtube: "قيم تجمعنا على يوتيوب",
      instagram: "قيم تجمعنا على إنستغرام",
    },
    values: {
      citizenship_shared_facility: "المواطنة الصالحة",
      tolerance_accent: "التسامح",
      peace_before_escalation: "السلام",
    },
    home: {
      title: "صف موقفًا تعيشه",
      lead: "اكتب ما حدث بكلماتك، وسنقترح عليك الرحلة الأقرب إليه: موقف ← اختيار ← حل ← أثر ← نص موثَّق ← موقف جديد تختبر به ما تعلمته.",
      cardsTitle: "أو اختر رحلة مباشرة",
      cardsLead: "ثلاث رحلات مراجَعة، ويمكنك البدء بأي منها.",
      openJourney: "ابدأ الرحلة",
    },
    router: {
      label: "صف موقفك",
      placeholder: "مثال: زميل جديد في العمل يسخر منه بعض الزملاء بسبب لهجته",
      submit: "ابحث عن الرحلة",
      submitting: "جارٍ البحث…",
      counter: "حرفًا",
      aiNotice: "هذه أداة مدعومة بالذكاء الاصطناعي وليست مختصًا بشريًا.",
      privacy:
        "يُرسَل نصك إلى خدمة ذكاء اصطناعي لاختيار الرحلة فقط، ولا نحفظه. يُرجى ألا يتضمن أسماءً أو تفاصيل شخصية.",
    },
    referral: {
      startOver: "ابدأ من جديد",
      specialistTitle: "يحتاج موقفك إلى مختص",
      safetyTitle: "سلامتك أولًا",
    },
    journey: {
      back: "رجوع",
      next: "التالي",
      start: "ابدأ",
      stepOf: "الخطوة {n} من {total}",
      progress: "التقدم في الرحلة",
      chooseOne: "اختر خيارًا واحدًا",
      yourChoice: "اختيارك",
      situation: "الموقف",
      effect: "أثر اختيارك",
      solution: "الحل في ثلاث خطوات",
      newSituation: "موقف جديد",
      newFeedback: "أثر اختيارك في الموقف الجديد",
      today: "خطوتك اليوم",
      trustIntro: "النص الذي تستند إليه هذه الرحلة",
      tryAnother: "جرّب رحلة أخرى",
      home: "العودة إلى الرئيسية",
    },
    trust: {
      quran: "آية قرآنية",
      hadith: "حديث نبوي",
      text: "النص",
      reference: "المرجع",
      grade: "الدرجة",
      translation: "ترجمة المعنى",
      explanation: "شرح (ليس جزءًا من النص)",
      explanationNote: "الشرح للتوضيح، والنص هو المذكور أعلاه.",
      verify: "تحقق من المصدر",
      reviewed: "راجعه {by} · {date} · الإصدار {version}",
      notReviewed: "لم تتم مراجعته بعد",
    },
    about: {
      metaTitle: "حول المنصة والتحقق | قيم مضيئة",
      metaDescription: "كيف تعمل المنصة، وعلاقتها ببرنامج «قيم تجمعنا»، وحدود دور الذكاء الاصطناعي فيها، والخصوصية.",
      title: "حول المنصة والتحقق",
      lead: "كيف تعمل المنصة، وما الذي يفعله الذكاء الاصطناعي فيها وما لا يفعله، وكيف نحمي خصوصيتك.",
      howTitle: "كيف تعمل؟",
      howSteps: [
        "تكتب موقفًا بكلماتك (حتى 500 حرف) أو تختار رحلة مباشرة.",
        "يمر النص أولًا بفحص آلي لعبارات الخطر الصريحة؛ فإن وُجدت تظهر رسالة دعم دون استدعاء الذكاء الاصطناعي.",
        "ثم يختار النموذج رمز رحلة واحدًا من قائمة مغلقة، أو يحيلك إلى مختص، أو يُظهر قائمة الرحلات الثلاث.",
        "تُعرض الرحلة من محتوى مراجَع ثابت: موقف، اختيار، حل، أثر، نص موثَّق، موقف جديد، خطوة اليوم.",
      ],
      programTitle: "المنصة وبرنامج «قيم تجمعنا»",
      programBody:
        "«قيم تجمعنا» برنامج إعلامي يُنشر على منصات التواصل الاجتماعي ويتضمن: رسائل قصيرة (تويتر)، ومقاطع مرئية (يوتيوب) ونشرات توعويّة (إنستغرام) تصل إلى جمهور متنوّع وتحفزه لزيارة المنصّة، فيحظى بمعرفة وتجربة تفاعليّة فيها تعلّم وتطبيق ورحلة مصحوبة بنصّ موثّق.",
      aiTitle: "دور الذكاء الاصطناعي وحدوده",
      aiPoints: [
        "نستخدم الاسترجاع المعزّز (RAG) في صورة مقيّدة: يحدّد النموذج الرحلة المناسبة لموقفك، ثم يسترجع النظام نصوصها المعتمدة (الموقف والحل والآية أو الحديث) من المكتبة المراجَعة ويعرضها كما هي، دون أن يولّد النموذج إجابة من عنده.",
        "النموذج لا يكتب نصًا شرعيًا ولا يرى آيات أو أحاديث: يرجع فقط رمز رحلة من قائمة مغلقة ومستوى ثقة.",
        "الآيات والأحاديث والخطوات والرسائل كلها تأتي من مكتبة محتوى مراجَعة، ولا يولّدها النموذج.",
        "عند ضعف الثقة يمتنع النظام عن التخمين ويعرض قائمة الرحلات.",
        "المنصة لا تصدر فتاوى ولا تحكم على الأحاديث؛ وتحيل الحالات الشخصية والمسائل الخلافية إلى مختص.",
        "قد يخطئ التوجيه أحيانًا؛ ولذلك نقيس دقته بتقييم منهجي بدل ادعاء الدقة المطلقة، وتبقى الرحلات الثلاث متاحة للاختيار المباشر دائمًا.",
      ],
      privacyTitle: "الخصوصية",
      privacyBody:
        "يُرسَل نصك إلى خدمة الذكاء الاصطناعي لاختيار الرحلة فقط، ولا نحفظه ولا نسجّله. لا حسابات، ولا حقل للدين، ولا تحليلات. يُرجى ألا تكتب أسماء أو تفاصيل شخصية.",
      approvalsTitle: "سجل اعتماد المحتوى",
      approvalsLead:
        "كل نص ظاهر في المنصة يجب أن يعتمده المراجع العلمي. يرتبط الاعتماد ببصمة نص الملف، فإن تغيّر حرف واحد بعد الاعتماد عاد الملف غير معتمد.",
      approved: "معتمد",
      status: "الحالة",
      draft: "مسودة",
      version: "الإصدار",
      by: "المراجع",
      on: "التاريخ",
      evalTitle: "نتائج التقييم",
      evalNone: "لم تُنشر نتائج تقييم بعد.",
      evalLead: "تُعرض النتائج كما سُجّلت، مع حدود الثقة، ومقارنة بخط أساس يعتمد الكلمات المفتاحية.",
      evalProvisional: "حالة الحالات التجريبية: مسودة الفريق بانتظار مصادقة المراجع.",
      model: "النموذج",
      promptHash: "بصمة التعليمات",
      commit: "إصدار الشيفرة",
      runAt: "وقت التشغيل",
      runs: "عدد التشغيلات لكل حالة",
      metric: "المقياس",
      keywordBaseline: "خط الأساس (كلمات مفتاحية)",
      haikuWithFloor: "Haiku مع فحص الأمان",
      haikuNoFloor: "Haiku دون فحص الأمان",
      metrics: {
        inScopeTop1: "الرحلة الصحيحة (حالات ضمن النطاق)",
        ambiguousHit: "الحالات الملتبسة (قبول أي خيار مقبول)",
        outOfScopeHandled: "خارج النطاق (عُولجت بأمان)",
        specialistRecall: "إحالة إلى مختص",
        safetyRecall: "إحالة السلامة",
        falseReferral: "إحالة خاطئة لحالة ضمن النطاق (الأقل أفضل)",
        consistency: "ثبات النتيجة عبر التشغيلات",
      },
      floorTitle: "فحص الأمان وحده",
      floorSafety: "حالات السلامة التي التقطها",
      floorWrong: "حالات ضمن النطاق التقطها خطأً",
      latency: "زمن الاستجابة (وسيط / المئين 95)",
      tokens: "متوسط الرموز لكل طلب (دخل / خرج)",
      failuresTitle: "إخفاقات معروفة",
      failuresNone: "لا إخفاقات مسجلة.",
      statusTitle: "حالة التوجيه الذكي",
      statusAvailable: "مُهيّأ (لم يُختبر بطلب فعلي)",
      statusUnavailable: "غير مُهيّأ",
      statusUnknown: "غير معروف",
      deferredTitle: "ما لم يدخل في هذا الإصدار",
      deferred: [
        "لغات أخرى غير العربية والإنجليزية.",
        "الحسابات والتحليلات والتذكيرات.",
      ],
    },
    aboutUs: {
      metaTitle: "من نحن | قيم مضيئة",
      metaDescription: "رؤية برنامج «قيم تجمعنا» ورسالته وأبرز أهدافه.",
      title: "من نحن؟",
      intro: "سفراء قيمٍ تضيء العقول والقلوب بمكارم الأخلاق.",
      visionTitle: "رؤيتنا",
      vision: "قيمنا الإسلاميّة تلهم الإنسانيّة.",
      missionTitle: "رسالتنا",
      mission:
        "تقديم سلسلة من البرامج الإعلامية على منصات التواصل الاجتماعي تتضمن: رسائل قصيرة (تويتر)، ومقاطع مرئية (يوتيوب) ونشرات توعويّة (إنستغرام) تصل إلى جمهور متنوّع وتحفزه لزيارة المنصّة؛ ليَحظى بمعرفة وتجربة تفاعليّة فيها تعلّمٌ وتطبيق ورحلة موثّقة.",
      goalsTitle: "أبرز أهدافنا",
      goals: [
        "ترجمة أهداف رؤية المملكة 2030 إلى برامج عمليّة تعرّف بالإسلام.",
        "تعزيز القيم الإسلامية لتكون محورًا ملهمًا للإنتاج الإعلامي المعاصر.",
        "إنتاج مرئيات وتطبيقات تسمو بالمحتوى الإسلامي.",
      ],
      programsTitle: "من برامجنا",
      programs:
        "«قيم تجمعنا» برنامج إعلامي يُنشر على منصات التواصل الاجتماعي ويتضمن: رسائل قصيرة (تويتر)، ومقاطع مرئية (يوتيوب) ونشرات توعويّة (إنستغرام) تصل إلى جمهور متنوّع وتحفزه لزيارة المنصّة، فيحظى بمعرفة وتجربة تفاعليّة فيها تعلّم وتطبيق ورحلة مصحوبة بنصّ موثّق.",
    },
  },
  en: {
    siteName: "Luminous Values",
    tagline: "Bringing the soul to its calm",
    skipLink: "Skip to content",
    metaTitle: "Luminous Values | From value to behaviour",
    metaDescription:
      "A learning platform that turns Islamic values into behaviour in everyday situations: describe your situation and an AI router sends you to a reviewed journey that ends with a verified source and a practical step.",
    nav: { label: "Main navigation", home: "Journey", aboutUs: "About us", about: "About and verification" },
    languageLabel: "Display language",
    themeLabel: "Appearance",
    themes: { light: "Najd", dark: "Night", emerald: "Emerald" },
    footer: {
      line: "Luminous Values · AI in the Service of Islamic Content Challenge 2026",
      partners:
        "Bathel Foundation · Saudi Data and AI Authority (SDAIA) · Ministry of Communications and Information Technology",
      license: "MIT open-source licence",
      followProgram: "Follow the «قيم تجمعنا» program",
    },
    social: {
      x: "قيم تجمعنا on X",
      youtube: "قيم تجمعنا on YouTube",
      instagram: "قيم تجمعنا on Instagram",
    },
    values: {
      citizenship_shared_facility: "Good citizenship",
      tolerance_accent: "Tolerance",
      peace_before_escalation: "Peace",
    },
    home: {
      title: "Describe a situation you are facing",
      lead: "Write what happened in your own words and we will suggest the closest journey: situation → choice → solution → effect → verified source → a new situation to test what you learned.",
      cardsTitle: "Or choose a journey directly",
      cardsLead: "Three reviewed journeys. You can start with any of them.",
      openJourney: "Start the journey",
    },
    router: {
      label: "Describe your situation",
      placeholder: "For example: a new colleague is mocked by some coworkers for his accent",
      submit: "Find my journey",
      submitting: "Searching…",
      counter: "characters",
      aiNotice: "This is an AI-supported tool, not a human specialist.",
      privacy:
        "Your text is sent to an AI service only to choose a journey, and is not stored by us. Please do not include names or personal details.",
    },
    referral: {
      startOver: "Start over",
      specialistTitle: "Your situation needs a specialist",
      safetyTitle: "Your safety comes first",
    },
    journey: {
      back: "Back",
      next: "Next",
      start: "Start",
      stepOf: "Step {n} of {total}",
      progress: "Journey progress",
      chooseOne: "Choose one option",
      yourChoice: "Your choice",
      situation: "The situation",
      effect: "The effect of your choice",
      solution: "The solution in three steps",
      newSituation: "A new situation",
      newFeedback: "The effect of your choice in the new situation",
      today: "Your step for today",
      trustIntro: "The text this journey rests on",
      tryAnother: "Try another journey",
      home: "Back to home",
    },
    trust: {
      quran: "Qur'anic verse",
      hadith: "Hadith",
      text: "The text",
      reference: "Reference",
      grade: "Grade",
      translation: "Translation of the meaning",
      explanation: "Explanation (not part of the text)",
      explanationNote: "The explanation is there to clarify. The text is what appears above.",
      verify: "Verify the source",
      reviewed: "Reviewed by {by} · {date} · version {version}",
      notReviewed: "Not reviewed yet",
    },
    about: {
      metaTitle: "About and verification | Luminous Values",
      metaDescription: "How the platform works, how it relates to the «قيم تجمعنا» program, the limits of the AI's role, and privacy.",
      title: "About and verification",
      lead: "How the platform works, what the AI does and does not do, and how we protect your privacy.",
      howTitle: "How does it work?",
      howSteps: [
        "You write a situation in your own words (up to 500 characters) or pick a journey directly.",
        "The text first passes an automatic check for explicit danger phrases; on a match a supportive message appears and the AI is not called.",
        "Then the model picks one journey ID from a closed list, refers you to a specialist, or shows the three-journey picker.",
        "The journey is shown from fixed reviewed content: situation, choice, solution, effect, verified source, new situation, today's step.",
      ],
      programTitle: "The platform and the «قيم تجمعنا» program",
      programBody:
        "«قيم تجمعنا» (Values That Bring Us Together) is a media program published on social platforms. It includes short messages (X / Twitter), video clips (YouTube) and awareness posts (Instagram) that reach a diverse audience and encourage them to visit the platform, where they gain knowledge and an interactive experience of learning, practice and a journey accompanied by a verified text.",
      aiTitle: "The AI's role and its limits",
      aiPoints: [
        "We use retrieval-augmented generation (RAG) in a restricted form: the model picks the journey that fits your situation, then the system retrieves that journey's approved texts (situation, solution, verse or hadith) from the reviewed library and shows them unchanged, without the model writing an answer of its own.",
        "The model writes no religious text and never sees verses or hadiths: it returns only a journey ID from a closed list and a confidence level.",
        "Verses, hadiths, steps and messages all come from a reviewed content library, and the model does not generate them.",
        "When confidence is low the system holds back instead of guessing, and shows the picker.",
        "The platform gives no fatwas and does not grade hadiths; personal cases and disputed questions are referred to a specialist.",
        "Routing can be wrong sometimes, so we measure its accuracy with a systematic evaluation instead of claiming perfection, and the three journeys can always be chosen directly.",
      ],
      privacyTitle: "Privacy",
      privacyBody:
        "Your text is sent to the AI service only to choose a journey, and we neither store nor log it. There are no accounts, no religion field and no analytics. Please do not write names or personal details.",
      approvalsTitle: "Content approval record",
      approvalsLead:
        "Every text shown on the platform must be approved by the content reviewer. Approval is bound to a hash of the file's text: if a single character changes after approval, the file goes back to unapproved.",
      approved: "Approved",
      status: "Status",
      draft: "Draft",
      version: "Version",
      by: "Reviewer",
      on: "Date",
      evalTitle: "Evaluation results",
      evalNone: "No evaluation results have been published yet.",
      evalLead: "Results are shown as recorded, with confidence intervals, against a keyword baseline.",
      evalProvisional: "Status of the test cases: drafted by the team, pending the reviewer's sign-off.",
      model: "Model",
      promptHash: "Prompt hash",
      commit: "Code version",
      runAt: "Run at",
      runs: "Runs per case",
      metric: "Metric",
      keywordBaseline: "Baseline (keywords)",
      haikuWithFloor: "Haiku with safety floor",
      haikuNoFloor: "Haiku without safety floor",
      metrics: {
        inScopeTop1: "Correct journey (in-scope cases)",
        ambiguousHit: "Ambiguous cases (any acceptable outcome)",
        outOfScopeHandled: "Out of scope (handled safely)",
        specialistRecall: "Referred to a specialist",
        safetyRecall: "Safety referral",
        falseReferral: "In-scope case wrongly referred (lower is better)",
        consistency: "Same result across runs",
      },
      floorTitle: "Safety floor alone",
      floorSafety: "Safety cases it caught",
      floorWrong: "In-scope cases it caught by mistake",
      latency: "Latency (median / 95th percentile)",
      tokens: "Mean tokens per request (input / output)",
      failuresTitle: "Known failures",
      failuresNone: "No failures recorded.",
      statusTitle: "Smart routing status",
      statusAvailable: "Configured (not tested with a live request)",
      statusUnavailable: "Not configured",
      statusUnknown: "Unknown",
      deferredTitle: "Not in this version",
      deferred: [
        "Languages other than Arabic and English.",
        "Accounts, analytics and reminders.",
      ],
    },
    aboutUs: {
      metaTitle: "About us | Luminous Values",
      metaDescription: "The vision, mission and main goals of the «قيم تجمعنا» program.",
      title: "Who are we?",
      intro: "Ambassadors of values that light up minds and hearts with noble character.",
      visionTitle: "Our vision",
      vision: "Our Islamic values inspire humanity.",
      missionTitle: "Our mission",
      mission:
        "To offer a series of media programs on social platforms, with short messages (X / Twitter), video clips (YouTube) and awareness posts (Instagram) that reach a diverse audience and encourage them to visit the platform, so that they gain knowledge and an interactive experience of learning, practice and a documented journey.",
      goalsTitle: "Our main goals",
      goals: [
        "Turning the goals of Saudi Vision 2030 into practical programs that introduce Islam.",
        "Strengthening Islamic values as an inspiring focus for contemporary media production.",
        "Producing visuals and applications that elevate Islamic content.",
      ],
      programsTitle: "Our programs",
      programs:
        "«قيم تجمعنا» (Values That Bring Us Together) is a media program published on social platforms. It includes short messages (X / Twitter), video clips (YouTube) and awareness posts (Instagram) that reach a diverse audience and encourage them to visit the platform, where they gain knowledge and an interactive experience of learning, practice and a journey accompanied by a verified text.",
    },
  },
};

export function asLang(s: string): Lang {
  return s === "en" ? "en" : "ar";
}

/** Replaces {key} placeholders; unknown keys are left as written. */
export function fmt(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in values ? String(values[k]) : m));
}
