import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from backend.core.config import settings
from backend.routers import values, scenarios, guardrails, health

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="الواجهة البرمجية المعتمدة لنظام «قيم مضيئة AI» - تحدي الذكاء الاصطناعي في خدمة المحتوى الإسلامي 2026",
    docs_url="/docs",
    redoc_url="/redoc"
)

# تمكين CORS لربط الواجهة الأمامية بسلاسة
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # يدعم الاتصال من Next.js على المنفذ 3000 أو أي نطاق استضافة
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# تتبع زمن معالجة الطلبات لإثبات السرعة الفائقة
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time-Sec"] = f"{process_time:.4f}"
    return response

# تسجيل المسارات
app.include_router(health.router)
app.include_router(values.router)
app.include_router(scenarios.router)
app.include_router(guardrails.router)

@app.get("/", summary="نقطة البداية ومعلومات النظام")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "description": "منصة تحويل القيم الإسلامية إلى مواقف سلوكية ملاحظة ومقاسة مع التأصيل الشرعي وجدار حماية ضد الفتوى والهلوسة",
        "documentation": "/docs",
        "endpoints": {
            "health": "/api/health",
            "values": "/api/values",
            "environments": "/api/values/environments",
            "generate_scenario": "/api/scenarios/generate",
            "guardrails_check": "/api/guardrails/check",
            "guardrails_test_suite": "/api/guardrails/test-suite"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
