# Changelog | سجل التطور

## 2026-10-04 — RAG end-to-end verified
- ضبط Jina document embedding على `retrieval.passage`, dimension `1024`.
- ضبط Jina query embedding على `retrieval.query`, dimension `1024`.
- استخدام Qdrant collection مستقلة: `bayyinah_jina_v1`, vector `dense`, Cosine.
- رفع Jina Batch Interval إلى `15000ms` بعد تجاوز TPM في المحاولة السابقة.
- نجاح إدخال `968` chunk من كتاب «بصائر» عبر Jina ثم Qdrant.
- نجاح `97` Qdrant upsert batches.
- نجاح تسجيل الكتاب كـprocessed.
- نجاح اختبار Telegram end-to-end وإظهار مصدر «بصائر» بالصفحتين 103 و110.

## 2026-10-04 — Baseline commit before success
الـCommit السابق في GitHub يوثق الحالة قبل النجاح النهائي:
- Jina TPM error: `101,278/100,000 tokens per minute`.
- `bayyinah_jina_v1` لم يكن قد ثبت إدخال الكتاب إليه.
- Qdrant Upsert URL كان قد تم إصلاحه، لكن التشغيل توقف قبل الوصول إليه.

نحتفظ بالـCommit السابق عمدًا لإظهار تطور المشروع من العائق إلى الحل بدل تعديل التاريخ.
