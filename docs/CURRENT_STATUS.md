# Current status | حالة التشغيل

## Status: BLOCKED - JINA TPM RATE LIMIT

آخر تشغيل كامل لمسار إدخال كتاب «بصائر» **فشل قبل Qdrant Upsert** داخل عقدة:

`Jina Embedding - Documents`

### Exact error

```text
The service is receiving too many requests from you [item 2]
Token rate limit exceeded: 101,278/100,000 tokens per minute.
Reduce batch sizes or upgrade your plan.
```

### What this means
- هذا ليس فشلًا في Qdrant ولا في بنية الـRAG نفسها.
- التشغيل توقف أثناء إنشاء document embeddings، قبل `Expand Jina Batch Embeddings` ثم `Prepare Qdrant Points` ثم `Qdrant Upsert Points`.
- آخر عدد تم التحقق منه قبل هذا التشغيل داخل `bayyinah_jina_v1` كان `0` points.
- نجح Jina Embedding سابقًا على 968 chunk في تشغيل منفصل، لكن هذا لا يساوي نجاح الإدخال end-to-end.

### Current verified configuration
- collection: `bayyinah_jina_v1`
- named vector: `dense`
- dimensions: `1024`
- distance: `Cosine`
- document task: `retrieval.passage`
- query task: `retrieval.query`
- source book: «بصائر»
- expected chunks: `968`
- current batching before failure: 25 chunks per Jina request, HTTP batch interval 10 seconds
- Qdrant Upsert URL was corrected to `bayyinah_jina_v1/points?wait=true` before this failed run.

### Next recommended retry
1. Change Jina HTTP Request `Batch Interval` from `10000ms` to `15000ms`.
2. Wait at least 60-90 seconds so the previous rolling TPM window clears.
3. Run the full ingestion workflow once.
4. Verify `bayyinah_jina_v1` point count.
5. Run a known question from «بصائر» and verify source/page payload.

### Mark SUCCESS only if
1. Qdrant `bayyinah_jina_v1` shows the expected point count (approximately/exactly 968 depending on final input).
2. A known question from «بصائر» returns relevant chunks from that book.
3. Payload preserves source/page metadata.

Do not call ingestion successful merely because embeddings complete.
