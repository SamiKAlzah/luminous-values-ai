from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, Union
from backend.core.guardrails import guardrails_service, GuardrailDecision
from backend.rag.engine import rag_engine, ExperienceCardResponse

router = APIRouter(prefix="/api/scenarios", tags=["Scenarios & Generation"])

class ScenarioRequest(BaseModel):
    value_id: str = Field(..., description="معرف القيمة (مثل: tolerance, citizenship, volunteering, dialogue, peace)")
    environment: str = Field(..., description="معرف البيئة (مثل: home, school, workplace, digital)")
    user_query: Optional[str] = Field(None, description="السؤال أو الاستفسار المخصص من المستخدم")
    language: str = Field("ar", description="اللغة المطلوبة: ar, en, fr, ur")

class GuardrailBlockedResponse(BaseModel):
    status: str = "blocked"
    guardrail: GuardrailDecision
    message: str

@router.get("", summary="استرجاع الموقف السلوكي المعتمد مباشرة")
def get_scenario(
    value_id: str = Query(..., description="معرف القيمة"),
    environment: str = Query(..., description="معرف البيئة"),
    language: str = Query("ar", description="اللغة المطلوبة")
):
    scenario = rag_engine.find_scenario(value_id, environment)
    if not scenario:
        raise HTTPException(status_code=404, detail="الموقف المطلوب غير موجود في قاعدة المعرفة")
    
    gt = scenario["islamic_ground_truth"]
    domain = "quranpedia.net" if gt["source_type"] == "quran" else "dorar.net"
    return {
        "value_id": scenario["value_id"],
        "value_name": scenario["value_name"].get(language, scenario["value_name"]["ar"]),
        "environment": scenario["environment"],
        "language": language,
        "fitrah_key": scenario["fitrah_key"].get(language, scenario["fitrah_key"]["ar"]),
        "behavior_title": scenario["title"],
        "observable_situation": scenario["observable_situation"],
        "actionable_steps": scenario["actionable_steps"],
        "islamic_ground_truth": gt,
        "is_fallback": True,
        "source_domain": domain,
        "status": "success"
    }

@router.post("/generate", summary="توليد وتخصيص بطاقة التجربة المعرفية مع الفرز الأمني الأول (First-pass Guardrail)")
async def generate_scenario(req: ScenarioRequest) -> Dict[str, Any]:
    """
    نقطة العبور التفاعلية الأساسية:
    1. فحص جدار الأمان (Guardrail Classifier) كطبقة أولى لحجب الفتاوى والنزاعات
    2. استدعاء محرك الـ RAG مع التأصيل الشرعي الصارم
    3. تفعيل مسار الطوارئ الفوري (Fallback) عند أي انقطاع للـ API الخارجي
    """
    # 1. طبقة الفرز الأمني الأولى: فحص المدخل قبل استدعاء الـ RAG أو LLM
    if req.user_query and req.user_query.strip():
        decision = guardrails_service.classify(req.user_query)
        if decision.is_blocked:
            return {
                "status": "blocked",
                "guardrail": decision.model_dump(),
                "response_text": decision.response,
                "justification": decision.justification,
                "level": decision.level,
                "action": decision.action
            }

    # 2. توليد بطاقة التجربة المعرفية الموثقة عبر الـ RAG والـ Fallback
    card = await rag_engine.generate_experience_card(
        value_id=req.value_id,
        environment=req.environment,
        user_query=req.user_query,
        language=req.language
    )

    return {
        "status": "success",
        "card": card.model_dump()
    }
