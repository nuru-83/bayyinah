# بيّنة | Bayyinah

نظام ذكي لدعم الدعاة في البحث والتحقق والإجابة الموثقة.

> **الحالة الحالية (2026-10-04):** آخر تشغيل كامل لإدخال كتاب «بصائر» فشل في `Jina Embedding - Documents` بسبب TPM: `101,278/100,000 tokens per minute` عند `item 2`، قبل Qdrant Upsert. آخر عدد متحقق منه في `bayyinah_jina_v1` قبل التشغيل كان `0` points. راجع `docs/CURRENT_STATUS.md` و`docs/PROBLEM_LOG.md`.

## الفكرة
المشكلة ليست نقص نموذج لغوي؛ بل صعوبة وصول الداعية بسرعة إلى دليل قابل للتتبع ثم معرفة هل يكفي فعلًا للإجابة. بيّنة يبني مسارًا من: قاعدة معرفة خاصة → استرجاع → تقييم كفاية الدليل → مصادر خارجية معتمدة عند الحاجة → مراجعة بشرية → جواب عربي موثق → تحقق → ترجمة تغرينية → تحقق من الترجمة.

**المبدأ:** بيّنة لا يستبدل المتخصص؛ بل يضاعف أثره.

## المعمارية الحالية
### Knowledge ingestion
`PDF source → external processing + QA → production JSONL → n8n → Jina embeddings-v3 (retrieval.passage, 1024) → Qdrant bayyinah_jina_v1 (dense, Cosine)`

### Retrieval
`Telegram → question routing → Jina embeddings-v3 (retrieval.query, 1024) → Qdrant query → preliminary score gate (0.35) → Evidence Judge → answer / approved external search / human review`

## مهم قبل استخدام هذا المستودع
- لا يحتوي هذا المستودع على الكتب الكاملة أو بيانات الاعتماد.
- ملف `workflow/bayyinah_baseline_SANITIZED.json` هو snapshot baseline من export سابق؛ **ليس تصديرًا مضمونًا لآخر live workflow بعد هجرة Jina**.
- أحدث التعديلات موثقة في `workflow/node_snippets/` و`docs/ARCHITECTURE.md`.
- بعد استقرار التشغيل يجب تصدير الـWorkflow الحي من n8n، تنظيفه من Credentials/IDs، واستبدال baseline snapshot.

## وثائق مهمة
- `docs/CURRENT_STATUS.md`
- `docs/PROBLEM_LOG.md`
- `docs/ARABIC_PDF_RAG.md`
- `docs/MENTOR_QUESTIONS.md`
- `docs/ARCHITECTURE.md`
- `SECURITY.md`
- `docs/SOURCE_RIGHTS.md`

## Dependencies / services
- n8n 2.41.4 (current stable used during hardening)
- Qdrant (collection uses named vector `dense`, dimension `1024`, Cosine)
- Jina AI Embeddings (`jina-embeddings-v3`)
- OpenAI (LLM evaluation / generation / verification)
- Tavily (approved-domain external search)
- Google Drive + Google Sheets
- Telegram Bot API
- Docling: historical/experimental raw-PDF path; not the current preferred production ingestion path for Arabic books

## Public-repo rule
Do not upload API keys, OAuth secrets, reviewer Telegram IDs, private Google Drive/Sheets IDs, full copyrighted books, or live user data.
