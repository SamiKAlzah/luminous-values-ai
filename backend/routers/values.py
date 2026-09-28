from fastapi import APIRouter, Query, HTTPException
from typing import List, Dict, Any
from backend.rag.engine import rag_engine

router = APIRouter(prefix="/api/values", tags=["Values & Environments"])

@router.get("", response_model=List[Dict[str, Any]], summary="استرجاع قائمة القيم الخمس المعتمدة")
def get_values(lang: str = Query("ar", description="اللغة المطلوبة: ar, en, fr, ur")):
    return rag_engine.get_values_list(lang=lang)

@router.get("/environments", response_model=List[Dict[str, str]], summary="استرجاع قائمة البيئات الأربع")
def get_environments():
    return rag_engine.get_environments_list()

@router.get("/{value_id}", response_model=Dict[str, Any], summary="استرجاع بيانات قيمة محددة بالكامل")
def get_value_detail(value_id: str):
    if value_id not in rag_engine.compiled_dataset:
        raise HTTPException(status_code=404, detail="القيمة المطلوبة غير موجودة")
    return rag_engine.compiled_dataset[value_id]
