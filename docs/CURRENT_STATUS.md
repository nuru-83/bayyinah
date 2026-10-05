# Current status | حالة التشغيل

## Status: VERIFIED END-TO-END ✅

بتاريخ 2026-10-04 اكتمل مسار RAG الجديد الخاص بكتاب «بصائر» من الإدخال حتى الإجابة عبر Telegram.

## ما تم إثباته في التشغيل الناجح
1. `Parse JSONL Chunks` مرّر `968` chunk.
2. `Build Gemini Batches` (الاسم التاريخي للعقدة؛ وهي الآن تغذي Jina) أنشأ `39` دفعة.
3. `Jina Embedding - Documents` اكتمل بنجاح بعد رفع Batch Interval إلى 15 ثانية.
4. `Expand Jina Batch Embeddings` أعاد `968` عنصرًا.
5. `Prepare Qdrant Points` جهّز `968` نقطة.
6. `Build Qdrant Batches` أنشأ `97` دفعة.
7. `Qdrant Upsert Points` اكتمل بنجاح.
8. `Prepare Processed Books Log` و`Mark Knowledge File as Processed` اكتملتا بنجاح.

## اختبار الاسترجاع End-to-End
تم إرسال سؤال تجريبي عبر Telegram حول التطور الصغير وعلاقته بالتطور الكبير. النظام:
- نفّذ query embedding باستخدام Jina `retrieval.query`.
- استرجع أدلة من Qdrant collection `bayyinah_jina_v1`.
- مرّر الأدلة عبر Evidence Judge.
- أنشأ جوابًا عربيًا.
- ترجم الجواب إلى التغرينية.
- أعاد مصدرين للتحقق من كتاب «بصائر»: الصفحة 103 والصفحة 110.

هذا الاختبار يثبت أن مسار:

`Telegram → Jina Query Embedding → Qdrant → Evidence Judge → Arabic Answer → Tigrinya Translation → Source/Page`

يعمل فعليًا في النسخة الحالية.

## التكوين الحالي المثبت
- collection: `bayyinah_jina_v1`
- named vector: `dense`
- dimensions: `1024`
- distance: `Cosine`
- document task: `retrieval.passage`
- query task: `retrieval.query`
- source book: «بصائر»
- chunks processed in successful ingestion: `968`
- Qdrant upsert batches: `97`
- Jina document Batch Interval that completed successfully: `15000ms`

## ما لم يعد Blocker
- Jina TPM لم يعد يمنع التشغيل الحالي بعد ضبط Batch Interval إلى 15 ثانية.
- Qdrant Upsert لم يعد يشير إلى Gemini collection؛ أصبح يكتب إلى `bayyinah_jina_v1`.
- `recommended_evidence_indexes` أصبح zero-based بصورة ثابتة.

## المشكلات المفتوحة غير المانعة للتشغيل
1. PDF عربي معقد: جودة الاستخراج من الخطوط القرآنية الخاصة وRTL ليست محلولة بصورة عامة.
2. الكتب القديمة في Cohere تحتاج migration/re-embedding إلى Jina.
3. `MIN_USABLE_SCORE = 0.35` يحتاج Benchmark بدل الاعتماد على قيمة أولية.
4. ingestion checkpoint/retry يحتاج تحسينًا حتى لا يعيد Embeddings عند فشل مرحلة لاحقة.
5. baseline workflow العام في GitHub ليس أحدث export حي؛ يجب استبداله لاحقًا بنسخة Jina sanitized نهائية.

## المرحلة التالية
انتقل المشروع من «إصلاح RAG الأساسي» إلى «تحسين الجودة والقياس»:
- Citation Verification
- Query Rewriting / Retrieval Retry
- Benchmark baseline
- Groundedness / Abstention
- Claim-level grounding / Evidence-gap recovery
- Evidence ledger
