import os
from pathlib import Path
from dotenv import load_dotenv

# تحميل متغيرات البيئة
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BASE_DIR.parent
DATA_DIR = PROJECT_ROOT / "data"

class Settings:
    PROJECT_NAME: str = "قيم مضيئة AI | Luminous Values AI"
    VERSION: str = "1.0.0"
    PORT: int = int(os.getenv("PORT", 8000))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # مسارات ملفات البيانات المعتمدة
    COMPILED_DATASET_PATH: Path = DATA_DIR / "compiled_dataset.json"
    SCENARIOS_INDEX_PATH: Path = DATA_DIR / "scenarios_rag_index.json"
    GUARDRAILS_TRAINING_PATH: Path = DATA_DIR / "guardrails_training_set.json"
    
    # مفاتيح مزودي الذكاء الاصطناعي (اختيارية مع نظام الـ Fallback)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # عتبة الحماية
    GUARDRAIL_SIMILARITY_THRESHOLD: float = float(os.getenv("GUARDRAIL_SIMILARITY_THRESHOLD", 0.65))

settings = Settings()
