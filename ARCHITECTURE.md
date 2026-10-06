# البنية التقنية المختصرة

```text
Telegram
  ↓
تحضير السؤال
  ↓
Jina Query Embedding
  ↓
Qdrant Retrieval
  ↓
Evidence Judge
  ├─ SUPPORTED → Grounded Answer
  ├─ NEEDS_EXTERNAL_SEARCH → Query Rewrite + Retrieval Retry
  │                            └─ إن بقي النقص → Approved External Sources
  └─ NEEDS_HUMAN_REVIEW → Human Review
                                  ↓
Citation Verification
  ├─ PASS
  ├─ REVISE → Minimal Revision → Re-verify
  └─ Human Review
          ↓
Answer Verification
          ↓
Tigrinya Translation
          ↓
Translation Verification
  ├─ PASS
  ├─ REVISE → Re-translate / Re-verify
  └─ Human Review
          ↓
Telegram final response
```

## التقنيات
- n8n: orchestration
- OpenAI models: reasoning / generation / verification
- Jina Embeddings v3: embeddings
- Qdrant: vector database
- Google Sheets: approved external source registry
- Telegram: MVP interface
- External search is restricted to approved domains selected by the workflow.
