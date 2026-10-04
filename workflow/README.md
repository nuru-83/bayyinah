# Workflow folder

`bayyinah_baseline_SANITIZED.json` is a sanitized **baseline snapshot** from an earlier export. It is useful for architecture review but does not contain every live Jina migration edit made later in n8n.

Use `node_snippets/` for the latest known Jina/Qdrant changes documented during the migration.

Before final submission: export the live workflow from n8n after the current ingestion test, sanitize credentials/IDs, and replace the baseline file.
