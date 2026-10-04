# Architecture | المعمارية الحالية

## 1) Ingestion

```text
PDF original
   ↓
External extraction / normalization / QA
   ↓
Production JSONL (one chunk per record + metadata + pages)
   ↓
n8n
   ↓
Jina Embeddings v3
  task = retrieval.passage
  dimensions = 1024
   ↓
Qdrant: bayyinah_jina_v1
  vector name = dense
  distance = Cosine
```

سبب فصل معالجة PDF: جودة العربية في PDF ليست مضمونة، خصوصًا RTL والتشكيل والخطوط القرآنية الخاصة. لذلك لا يُسمح للـPDF الخام أن يدخل الـRAG تلقائيًا دون QA.

## 2) Retrieval

```text
Telegram question
   ↓
Prepare / classify / route
   ↓
Jina Embeddings v3
  task = retrieval.query
  dimensions = 1024
   ↓
Qdrant bayyinah_jina_v1 / points/query
   ↓
Evaluate Retrieval Sufficiency
  MIN_USABLE_SCORE = 0.35 (provisional)
   ↓
Evidence Judge
   ↓
SUPPORTED | NEEDS_EXTERNAL_SEARCH | NEEDS_HUMAN_REVIEW
```

## 3) Vector-space rule
Cohere 1024 and Jina 1024 are **not** interchangeable. Equal dimensions do not mean equal vector space. A Jina query must search Jina-embedded documents only.

## 4) Current book QA example: بصائر
- 908 PDF pages
- 237 actual question units (1-238, with #3 absent in source)
- 968 chunks
- 0 duplicate IDs
- 0 empty chunks
- 0 missing units
- 781 pages flagged for Quranic/special glyphs

## 5) Pending design improvements
- checkpointed ingestion so embedding does not repeat after an Upsert failure
- benchmark-based threshold / Top-K calibration
- controlled migration of old Cohere points to Jina
- dual representation proposal: normalized retrieval text + source-faithful display text, with explicit lineage
