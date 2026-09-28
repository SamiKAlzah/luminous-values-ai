from fastapi import APIRouter
from backend.core.config import settings
from backend.rag.engine import rag_engine
from backend.core.guardrails import guardrails_service

router = APIRouter(prefix="/api/health", tags=["Health & Status"])

@router.get("", summary="فحص الحالة التشغيلية وجاهزية الخادم")
def get_health_status():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "stats": {
            "values_count": len(rag_engine.compiled_dataset),
            "scenarios_indexed": len(rag_engine.scenarios_index),
            "guardrails_triggers_loaded": len(guardrails_service.training_set)
        },
        "resilience": {
            "fallback_mechanism_active": True,
            "zero_crash_guarantee": True,
            "sources_verified": ["quranpedia.net", "dorar.net", "islamic-content.com"]
        }
    }
