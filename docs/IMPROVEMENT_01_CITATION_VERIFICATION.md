# Improvement 01 — Claim-Level Citation Verification

## Goal
Prevent an answer from reaching translation or the user when one or more substantive claims are not supported by the retrieved evidence.

## Architecture

```text
Generate Grounded Answer
        ↓
Parse Grounded Answer
        ↓
Citation Verification
        ↓
Parse Citation Verification
        ↓
Route Citation Verification
   ├─ PASS → Answer Verification
   ├─ REVISE → Check Answer Revision Attempt → Revise Grounded Answer
   │            → Prepare Revised Grounded Answer → Store Revised Answer Context
   │            → Citation Verification
   └─ NEEDS_HUMAN_REVIEW → Human Review
```

## Verification responsibilities
The new layer:
1. Extracts substantive claims from `answer_ar`.
2. Maps each claim to zero-based `combined_evidence` indexes.
3. Verifies page/source metadata.
4. Detects unsupported claims.
5. Calculates groundedness and citation correctness.
6. Blocks `PASS` when unsupported claims or invalid citations exist.

## Metric definitions

### Groundedness
`number of supported substantive claims / total substantive claims`

### Citation correctness
`number of valid citations that actually support the answer / total checked citations`

The parser recalculates these metrics deterministically from the verification details instead of trusting only the score returned by the LLM.

## Automatic revision policy
Revision uses a **Minimal Revision** policy:
- Do not rewrite the whole answer.
- Do not add new evidence, arguments, names, statistics, pages, or sources.
- Execute only `required_corrections`.
- Remove or soften unsupported claims.
- Send the revised answer back through Citation Verification before it can continue.

## Verified result
A real test detected one unsupported claim in an otherwise grounded answer.

Before revision:
- Groundedness: 0.8333
- Citation correctness: 1.0
- Unsupported claims: 1
- Decision: REVISE

After minimal revision and re-verification:
- Groundedness: 1.0
- Citation correctness: 1.0
- Unsupported claims: 0
- Decision: PASS

The final answer was then delivered in Arabic and Tigrinya with verified citations.
