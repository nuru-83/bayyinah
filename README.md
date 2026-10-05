# بيّنة | Bayyinah

نظام ذكي لدعم الدعاة في البحث والتحقق والإجابة الموثقة.

> **الحالة الحالية (2026-10-04): VERIFIED END-TO-END ✅**  
> اكتمل إدخال كتاب «بصائر» عبر Jina Embeddings إلى Qdrant، ثم نجح اختبار استرجاع فعلي من Telegram: عاد جواب عربي، وترجمة تغرينية، ومراجع من «بصائر» بالصفحتين 103 و110. راجع `docs/CURRENT_STATUS.md` و`evidence/rag_end_to_end_verification_2026-10-04.md`.

## الفكرة
المشكلة ليست نقص نموذج لغوي؛ بل صعوبة وصول الداعية بسرعة إلى دليل قابل للتتبع ثم معرفة هل يكفي فعلًا للإجابة. بيّنة يبني مسارًا من: قاعدة معرفة خاصة → استرجاع → تقييم كفاية الدليل → مصادر خارجية معتمدة عند الحاجة → مراجعة بشرية → جواب عربي موثق → تحقق → ترجمة تغرينية → تحقق من الترجمة.

**المبدأ:** بيّنة لا يستبدل المتخصص؛ بل يضاعف أثره.

## المعمارية الحالية
### Knowledge ingestion
`PDF source → external processing + QA → production JSONL → n8n → Jina embeddings-v3 (retrieval.passage, 1024) → Qdrant bayyinah_jina_v1 (dense, Cosine)`

### Retrieval
`Telegram → question routing → Jina embeddings-v3 (retrieval.query, 1024) → Qdrant query → preliminary score gate (0.35) → Evidence Judge → answer / approved external search / human review`

## ما تم التحقق منه فعليًا
- كتاب «بصائر» جُهّز إلى `968` chunk مرتبطة بالمصدر والصفحة.
- مسار Jina document embeddings اكتمل في التشغيل الناجح.
- `Prepare Qdrant Points` مرّر `968` نقطة.
- `Build Qdrant Batches` أنشأ `97` دفعة Qdrant.
- `Qdrant Upsert Points` اكتمل دون خطأ، ثم سُجّل الكتاب كـprocessed.
- اختبار Telegram أعاد أدلة من «بصائر» ثم جوابًا عربيًا وترجمة تغرينية مع الصفحتين `103` و`110`.

## ما زال يحتاج تحسينًا
- جودة استخراج بعض ملفات PDF العربية المعقدة والخطوط القرآنية الخاصة ليست مشكلة محلولة بصورة عامة.
- ترحيل الكتب القديمة من فضاء Cohere إلى Jina لم يكتمل.
- عتبة الاسترجاع `0.35` ما زالت قيمة أولية وتحتاج Benchmark.
- يلزم checkpoint/retry دائم حتى لا تُعاد تكلفة الـEmbedding عند فشل مرحلة لاحقة.
- المرحلة التالية: Citation Verification، Query Rewrite/Retry، Benchmark، Groundedness/Abstention.

## مهم قبل استخدام هذا المستودع
- لا يحتوي هذا المستودع على الكتب الكاملة أو بيانات الاعتماد.
- ملف `workflow/bayyinah_baseline_SANITIZED.json` هو snapshot baseline من export سابق؛ **ليس تصديرًا مضمونًا لآخر live workflow بعد هجرة Jina**.
- أحدث التعديلات موثقة في `workflow/node_snippets/` و`docs/ARCHITECTURE.md`.
- بعد استقرار التحسينات يجب تصدير الـWorkflow الحي من n8n، تنظيفه من Credentials/IDs، واستبدال baseline snapshot.

## وثائق مهمة
- `docs/CURRENT_STATUS.md`
- `docs/PROBLEM_LOG.md`
- `docs/CHANGELOG.md`
- `docs/IMPROVEMENT_PLAN.md`
- `docs/ARABIC_PDF_RAG.md`
- `docs/MENTOR_QUESTIONS.md`
- `docs/ARCHITECTURE.md`
- `SECURITY.md`
- `docs/SOURCE_RIGHTS.md`

## Dependencies / services
- n8n 2.41.4
- Qdrant (`dense`, dimension `1024`, Cosine)
- Jina AI Embeddings (`jina-embeddings-v3`)
- OpenAI (LLM evaluation / generation / verification)
- Tavily (approved-domain external search)
- Google Drive + Google Sheets
- Telegram Bot API
- Docling: historical/experimental raw-PDF path; not the current preferred production ingestion path for Arabic books

## Public-repo rule
Do not upload API keys, OAuth secrets, reviewer Telegram IDs, private Google Drive/Sheets IDs, full copyrighted books, or live user data.
