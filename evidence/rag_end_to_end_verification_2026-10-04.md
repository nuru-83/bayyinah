# RAG end-to-end verification — 2026-10-04

## Ingestion evidence
نجح التشغيل الكامل لمسار إدخال كتاب «بصائر» بعد ضبط Jina Batch Interval إلى 15 ثانية.

الأعداد الظاهرة في execution:
- source chunks: `968`
- Jina request batches: `39`
- expanded embeddings: `968`
- prepared Qdrant points: `968`
- Qdrant upsert batches: `97`
- processed-book log: completed

## Retrieval evidence
تم إرسال سؤال فعلي عبر Telegram حول العلاقة بين التطور الصغير والتطور الكبير.

النظام أعاد:
- إجابة عربية.
- ترجمة تغرينية.
- مصدر: «بصائر».
- صفحات الاستشهاد: `103`, `110`.

هذا يثبت عمليًا مرور السؤال عبر query embedding والاسترجاع من Qdrant ثم Evidence Judge والصياغة والترجمة وإظهار المصدر/الصفحة.

## Scope of this verification
هذا الاختبار يثبت أن المسار يعمل End-to-End، لكنه لا يثبت وحده أن كل استرجاع أو استشهاد صحيح. لذلك المرحلة التالية هي Benchmark + Citation Verification + Groundedness/Abstention.
