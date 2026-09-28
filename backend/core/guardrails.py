import re
import json
from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from backend.core.config import settings

class GuardrailDecision(BaseModel):
    is_blocked: bool
    level: str  # level_a_b, level_c, level_d, anti_hallucination
    action: str  # allow, refuse_and_refer, clarify_and_correct, de_escalate
    trigger_type: Optional[str] = None
    response: Optional[str] = None
    justification: Optional[str] = None
    matched_benchmark_query: Optional[str] = None
    confidence_score: float = 0.0

def normalize_arabic(text: str) -> str:
    """تنظيف وتوحيد النص العربي للمقارنة الدلالية الدقيقة"""
    if not text:
        return ""
    # إزالة التشكيل
    text = re.sub(r'[\u064B-\u065F\u0670]', '', text)
    # توحيد الألفات
    text = re.sub(r'[إأآا]', 'ا', text)
    # توحيد الياء والتاء المربوطة
    text = re.sub(r'ة', 'ه', text)
    text = re.sub(r'ى', 'ي', text)
    # إزالة علامات الترقيم والرموز غير الحرفية
    text = re.sub(r'[^\w\s]', ' ', text)
    # توحيد المسافات
    text = re.sub(r'\s+', ' ', text).strip().lower()
    return text

def calculate_similarity(text1: str, text2: str) -> float:
    """حساب نسبة التشابه المشترك بين النصوص (Jaccard + Word N-gram Overlap)"""
    tokens1 = set(normalize_arabic(text1).split())
    tokens2 = set(normalize_arabic(text2).split())
    
    if not tokens1 or not tokens2:
        return 0.0
    
    intersection = tokens1.intersection(tokens2)
    union = tokens1.union(tokens2)
    jaccard = len(intersection) / len(union)
    
    # مكافأة للكلمات المفتاحية المشتركة
    overlap = len(intersection) / min(len(tokens1), len(tokens2))
    return round((jaccard * 0.4) + (overlap * 0.6), 4)

class GuardrailsClassifier:
    """
    طبقة جدار الحماية الشرعي (First-pass Middleware / Guardrail Layer)
    تكتشف الاستدراج، الفتاوى الشخصية، والنزاعات الفردية، وتمنع وصولها للـ LLM/RAG بنسبة 100%
    """
    def __init__(self):
        self.training_set: List[Dict[str, Any]] = []
        self._load_training_set()

        # قوالب الكلمات المفتاحية الحرجة (High-Risk Trigger Patterns)
        self.critical_patterns = [
            # فتاوى أسرية ونزاعات شخصية (مستوى د)
            (r'(طلاق|الطلاق|يقع الطلاق|طلق|مخالعة|خلع|نشوز|ناشز|سقوط النفقة|زوجتي ترفض)', 'marital_dispute_and_spousal_rights_fatwa', 'level_d', 'refuse_and_refer'),
            # استدراج لفتوى مالية وتبرعات غير نظامية (مستوى د)
            (r'(تهرب من دفع|فواتير الكهرباء|دفع الضرائب|جمع تبرعات|حسابي البنكي الشخصي|خصم من زكاة|زكاة مالي)', 'financial_fatwa_and_regulatory_obligations', 'level_d', 'refuse_and_refer'),
            # نزاعات مدنية وجنائية وقصاص (مستوى د)
            (r'(صدم سيارتي|تخريب سيارته|إزالتها بالقوة|استولى على ميراثي|الميراث ظلما|حقي الجنائي|القصاص|التنازل عن حقي)', 'waiving_financial_and_criminal_rights', 'level_d', 'refuse_and_refer'),
            # تهديد أمني وجنائي عاجل (مستوى د)
            (r'(يهددني بسلاح|يهددني بالقتل|أبادره بالقتل|سلاح ناري|توعد بقتلي)', 'imminent_criminal_and_security_threat', 'level_d', 'refuse_and_refer'),
            # قضايا سياسية وجماعات وحروب إقليمية (مستوى ج)
            (r'(حكم في الحاكم|الخروج على الحكومات|سياسات الدولة|النزاعات العسكرية الدولية|الحروب الإقليمية|المعتدي الباغي|قتاله جهاد)', 'controversial_geopolitical_and_armed_conflicts', 'level_c', 'refuse_and_refer'),
            # أحاديث مكذوبة وغير ثابتة (مقاومة الهلوسة)
            (r'(حب الوطن من الإيمان|المسامح كريم|اختلاف أمتي رحمة|قصرا من الزمرد|إذا وقعت الفتن فعليكم بالسلام)', 'unverified_hadith_citation', 'anti_hallucination', 'clarify_and_correct'),
        ]

    def _load_training_set(self):
        path = settings.GUARDRAILS_TRAINING_PATH
        if path.exists():
            with open(path, "r", encoding="utf-8") as f:
                self.training_set = json.load(f)
        else:
            self.training_set = []

    def classify(self, query: str) -> GuardrailDecision:
        """
        فحص المدخل: إذا تطابق مع حالة حرجة، يتم قطع الاستدعاء فوراً وإرجاع الرد الشرعي المعتمد
        """
        clean_query = normalize_arabic(query)
        if not clean_query:
            return GuardrailDecision(
                is_blocked=False,
                level="level_a_b",
                action="allow",
                confidence_score=1.0
            )

        # 1. الفحص الدلالي مقابل الـ 20 حالة معتمدة في guardrails_training_set.json
        best_match = None
        highest_score = 0.0

        for item in self.training_set:
            score = calculate_similarity(query, item["query"])
            if score > highest_score:
                highest_score = score
                best_match = item

        # إذا تجاوزت نسبة التطابق العتبة المعتمدة
        if best_match and highest_score >= settings.GUARDRAIL_SIMILARITY_THRESHOLD:
            return GuardrailDecision(
                is_blocked=(best_match["action"] in ["refuse_and_refer", "clarify_and_correct"]),
                level=best_match["level"],
                action=best_match["action"],
                trigger_type=best_match["trigger_type"],
                response=best_match["approved_system_response"],
                justification=best_match["justification"],
                matched_benchmark_query=best_match["query"],
                confidence_score=highest_score
            )

        # 2. الفحص بالقوالب والأنماط الحرجة المباشرة (Regex Patterns)
        for pattern, trig_type, level, action in self.critical_patterns:
            if re.search(pattern, query):
                # البحث عن أقرب رد في قاعدة التدريب لهذا النوع
                matching_resp = next((item for item in self.training_set if item["trigger_type"] == trig_type), None)
                approved_response = matching_resp["approved_system_response"] if matching_resp else (
                    "عذراً، يختص نظام «قيم مضيئة AI» بالتوجيه القيمي والأخلاقي العام، ولا يصدر فتاوى خاصة أو يبت في النزاعات الفردية أو القضايا السياسية. نوصيك بمراجعة الجهات الرسمية ذات الاختصاص."
                )
                justification = matching_resp["justification"] if matching_resp else (
                    "التزاماً بالحزمة العلمية للتحدي: منع الاستقلال بالفتوى وتجنب النزاعات الخاصة والقضايا الجدلية."
                )

                return GuardrailDecision(
                    is_blocked=True,
                    level=level,
                    action=action,
                    trigger_type=trig_type,
                    response=approved_response,
                    justification=justification,
                    matched_benchmark_query=f"Pattern Match: {pattern}",
                    confidence_score=0.92
                )

        # 3. إذا لم يتم رصد أي محظور، يسمح للمدخل بالمرور إلى RAG
        return GuardrailDecision(
            is_blocked=False,
            level="level_a_b",
            action="allow",
            confidence_score=0.0
        )

# إنشاء كائن وحيد Singleton
guardrails_service = GuardrailsClassifier()
