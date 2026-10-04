# Setup checklist (mentor/reviewer version)

1. Import a cleaned n8n workflow export.
2. Configure n8n Credentials for Google Drive, Google Sheets, Telegram, OpenAI, Tavily, Jina, and Qdrant.
3. Create Qdrant collection for Jina:
   - name: `bayyinah_jina_v1`
   - named vector: `dense`
   - size: `1024`
   - distance: `Cosine`
4. Document embeddings:
   - endpoint: `https://api.jina.ai/v1/embeddings`
   - model: `jina-embeddings-v3`
   - task: `retrieval.passage`
   - dimensions: `1024`
5. Query embeddings: same model, task `retrieval.query`, dimensions `1024`.
6. Put only reviewed production JSONL files in the ingestion input folder.
7. Run ingestion and verify Qdrant point count before testing Telegram retrieval.
8. Run a known-answer query and verify source/page metadata.
