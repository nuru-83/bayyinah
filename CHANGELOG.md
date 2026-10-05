# CHANGELOG

## 2026-10-05 — Claim-level Citation Verification

Added an independent citation-verification layer between answer generation and final answer verification.

### What changed
- Added `Citation Verification`.
- Added `Parse Citation Verification`.
- Added `Route Citation Verification`.
- Added automatic revision loop for unsupported claims.
- Revised answers return to Citation Verification before continuing.
- Added deterministic metrics:
  - `groundedness_score`
  - `citation_correctness_score`
  - `supported_claims_count`
  - `unsupported_claims_count`

### Verified test
Initial verification:
- `verification = REVISE`
- `groundedness_score = 0.8333`
- `citation_correctness_score = 1.0`
- `unsupported_claims = 1`

After minimal automatic revision:
- `verification = PASS`
- `groundedness_score = 1.0`
- `citation_correctness_score = 1.0`
- `unsupported_claims = 0`

The final Arabic answer continued through answer verification, Tigrinya translation, and Telegram delivery with citations to *Basair* pages 103, 104, and 110.
