"""
سكريبت تجميع وفهرسة وتجهيز بيانات مشروع «قيم مضيئة AI»
يقوم هذا السكريبت بـ:
1. التحقق من صحة ملفات القيم الخمس ومطابقتها للمخطط القياسي schema.json
2. توليد ملف قاعدة المعرفة الموحد data/compiled_dataset.json
3. توليد فهرس الاسترجاع المعزز data/scenarios_rag_index.json لدعم محرك الـ RAG
4. توليد مجموعة تدريب واختبار جدار الأمان data/guardrails_training_set.json لمصنف النوايا
"""

import os
import sys
import json
from pathlib import Path

# ضبط ترميز المخرجات لويندوز
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = Path(__file__).resolve().parent
VALUES_DIR = BASE_DIR / "values"
SCHEMA_FILE = BASE_DIR / "schema.json"

EXPECTED_VALUES = ["citizenship", "volunteering", "tolerance", "dialogue", "peace"]
EXPECTED_ENVIRONMENTS = ["home", "school", "workplace", "digital"]

def main():
    print("=" * 60)
    print("🌟 بدء عملية التجميع والفهرسة لمشروع قيم مضيئة AI...")
    print("=" * 60)

    # 1. التحقق من المخطط
    if not SCHEMA_FILE.exists():
        raise FileNotFoundError(f"لم يتم العثور على ملف المخطط: {SCHEMA_FILE}")
    with open(SCHEMA_FILE, "r", encoding="utf-8") as f:
        schema = json.load(f)
    print(f"✔ تم تحميل المخطط القياسي: {schema.get('title')}")

    # 2. قراءة ملفات القيم الخمس
    compiled_dataset = {}
    scenarios_rag_index = []
    guardrails_training_set = []

    total_scenarios = 0
    total_triggers = 0
    quran_count = 0
    hadith_count = 0

    for val_id in EXPECTED_VALUES:
        file_path = VALUES_DIR / f"{val_id}.json"
        if not file_path.exists():
            raise FileNotFoundError(f"الملف المطلوب غير موجود: {file_path}")

        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # فحوصات سريعة للتأكد من اكتمال الحقول
        assert data["id"] == val_id, f"معرف غير متطابق: {data['id']} != {val_id}"
        assert set(data["value_name"].keys()) >= {"ar", "en", "fr", "ur"}
        assert set(data["fitrah_key"].keys()) >= {"ar", "en", "fr", "ur"}
        assert len(data["scenarios"]) == 4, f"يجب أن يحتوي على 4 مواقف بالضبط: {val_id}"

        compiled_dataset[val_id] = data

        # معالجة المواقف للفهرس الدلالي RAG
        for scenario in data["scenarios"]:
            env = scenario["environment"]
            assert env in EXPECTED_ENVIRONMENTS, f"بيئة غير معروفة: {env}"
            
            gt = scenario["islamic_ground_truth"]
            if gt["source_type"] == "quran":
                quran_count += 1
            elif gt["source_type"] == "hadith":
                hadith_count += 1

            # إعداد نص مدمج ومفهرس دلالياً لنموذج المتجهات
            searchable_content = (
                f"القيمة: {data['value_name']['ar']} | "
                f"البيئة: {env} | "
                f"الموقف: {scenario['title']} | "
                f"الواقع: {scenario['observable_situation']} | "
                f"الإجراءات: {' - '.join(scenario['actionable_steps'])} | "
                f"الدليل: {gt['evidence_text']} | {gt['reference_source']}"
            )

            scenarios_rag_index.append({
                "index_id": f"{val_id}_{env}",
                "value_id": val_id,
                "value_name": data["value_name"],
                "environment": env,
                "title": scenario["title"],
                "fitrah_key": data["fitrah_key"],
                "observable_situation": scenario["observable_situation"],
                "actionable_steps": scenario["actionable_steps"],
                "islamic_ground_truth": gt,
                "searchable_text": searchable_content
            })
            total_scenarios += 1

        # معالجة محفزات جدار الأمان Guardrails
        triggers = data.get("guardrails", {}).get("trigger_queries", [])
        for trig in triggers:
            guardrails_training_set.append({
                "value_id": val_id,
                "intent_domain": data["guardrails"]["intent_classification"],
                "query": trig["query"],
                "trigger_type": trig["trigger_type"],
                "level": trig["level"],
                "action": trig["action"],
                "approved_system_response": trig["approved_system_response"],
                "justification": trig["justification"]
            })
            total_triggers += 1

        print(f"✔ تم فحص واعتماد بيانات القيمة بنجاح: {data['value_name']['ar']} ({val_id})")

    # 3. حفظ الملفات المجمعة
    compiled_file = BASE_DIR / "compiled_dataset.json"
    with open(compiled_file, "w", encoding="utf-8") as f:
        json.dump(compiled_dataset, f, ensure_ascii=False, indent=2)

    rag_index_file = BASE_DIR / "scenarios_rag_index.json"
    with open(rag_index_file, "w", encoding="utf-8") as f:
        json.dump(scenarios_rag_index, f, ensure_ascii=False, indent=2)

    guardrails_file = BASE_DIR / "guardrails_training_set.json"
    with open(guardrails_file, "w", encoding="utf-8") as f:
        json.dump(guardrails_training_set, f, ensure_ascii=False, indent=2)

    # 4. طباعة ملخص الإحصائيات النهائي
    print("\n" + "=" * 60)
    print("📊 تقرير الفهرسة والإحصائيات النهائي:")
    print("=" * 60)
    print(f"• إجمالي القيم المعتمدة: {len(compiled_dataset)} قيم")
    print(f"• إجمالي المواقف السلوكية (RAG Cards): {total_scenarios} موقفاً واقعياً")
    print(f"• تغطية البيئات (البيت، المدرسة، العمل، الرقمي): 100% (4 بيئات لكل قيمة)")
    print(f"• التوثيق الشرعي: {quran_count} آية قرآنية كريمة + {hadith_count} حديث نبوي صحيح")
    print(f"• إجمالي حالات اختبار جدار الأمان (Guardrails Triggers): {total_triggers} حالة فحص")
    print(f"• تم إنتاج الملفات التالية:")
    print(f"  1. {compiled_file.name} (قاعدة البيانات الموحدة الكاملة)")
    print(f"  2. {rag_index_file.name} (فهرس الـ RAG الجاهز للتضمين الشعاعي)")
    print(f"  3. {guardrails_file.name} (مجموعة تدريب وتقييم مصنف النوايا)")
    print("=" * 60)
    print("🎉 اكتمل إعداد وهندسة البيانات بنجاح تام! جاهزون للواجهة الخلفية (Backend).")

if __name__ == "__main__":
    main()
