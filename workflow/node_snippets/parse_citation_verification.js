// Bayyinah | Parse Citation Verification
const input = $input.first().json;

let raw = input.output ?? input.text ?? input.response ?? '';
raw = String(raw)
  .replace(/```json/gi, '')
  .replace(/```/g, '')
  .trim();

let result;
try {
  result = JSON.parse(raw);
} catch (error) {
  throw new Error(
    'تعذر قراءة ناتج Citation Verification كـ JSON.\n\nالناتج:\n' + raw
  );
}

const allowedVerifications = [
  'PASS',
  'REVISE',
  'NEEDS_HUMAN_REVIEW'
];

if (!allowedVerifications.includes(result.verification)) {
  throw new Error(
    'قيمة verification غير صحيحة: ' + result.verification
  );
}

function getNodeJson(nodeName) {
  try {
    return $(nodeName).first().json || null;
  } catch (error) {
    return null;
  }
}

const revisedContext = getNodeJson('Store Revised Answer Context');
const originalContext = getNodeJson('Parse Grounded Answer');
const context = revisedContext || originalContext || {};

const combinedEvidence =
  Array.isArray(context.combined_evidence)
    ? context.combined_evidence
    : [];

const sourcesUsed =
  Array.isArray(context.sources_used)
    ? context.sources_used
    : [];

const rawClaimVerifications =
  Array.isArray(result.claim_verifications)
    ? result.claim_verifications
    : [];

const claimVerifications =
  rawClaimVerifications.map((claim, index) => {
    const evidenceIndexes =
      Array.isArray(claim.evidence_indexes)
        ? [...new Set(
            claim.evidence_indexes
              .map(value => Number(value))
              .filter(value =>
                Number.isInteger(value) &&
                value >= 0 &&
                value < combinedEvidence.length
              )
          )]
        : [];

    const sourcePages =
      Array.isArray(claim.source_pages)
        ? [...new Set(
            claim.source_pages.filter(
              value =>
                value !== null &&
                value !== undefined &&
                String(value).trim() !== ''
            )
          )]
        : [];

    return {
      claim_index: index,
      claim: String(claim.claim || '').trim(),
      supported: claim.supported === true,
      evidence_indexes: evidenceIndexes,
      source_pages: sourcePages,
      note: String(claim.note || '').trim()
    };
  });

const rawCitationChecks =
  Array.isArray(result.citation_checks)
    ? result.citation_checks
    : [];

const citationChecks =
  rawCitationChecks.map((citation, index) => {
    const matchedEvidenceIndexes =
      Array.isArray(citation.matched_evidence_indexes)
        ? [...new Set(
            citation.matched_evidence_indexes
              .map(value => Number(value))
              .filter(value =>
                Number.isInteger(value) &&
                value >= 0 &&
                value < combinedEvidence.length
              )
          )]
        : [];

    return {
      source_index:
        Number.isInteger(Number(citation.source_index))
          ? Number(citation.source_index)
          : index,
      valid: citation.valid === true,
      supports_answer: citation.supports_answer === true,
      matched_evidence_indexes: matchedEvidenceIndexes,
      issues: Array.isArray(citation.issues) ? citation.issues : []
    };
  });

const totalClaims = claimVerifications.length;
const supportedClaimsCount =
  claimVerifications.filter(claim => claim.supported === true).length;

const groundednessScore =
  totalClaims > 0
    ? supportedClaimsCount / totalClaims
    : 0;

const totalCitations = citationChecks.length;
const validSupportingCitations =
  citationChecks.filter(
    citation =>
      citation.valid === true &&
      citation.supports_answer === true
  ).length;

let citationCorrectnessScore;
if (totalCitations > 0) {
  citationCorrectnessScore =
    validSupportingCitations / totalCitations;
} else {
  citationCorrectnessScore = sourcesUsed.length > 0 ? 0 : 1;
}

const roundScore = value =>
  Math.round(value * 10000) / 10000;

let confidence = Number(result.confidence);
if (!Number.isFinite(confidence)) confidence = 0;
confidence = Math.max(0, Math.min(1, confidence));

const unsupportedClaimsFromChecks =
  claimVerifications
    .filter(claim => !claim.supported)
    .map(claim => claim.claim)
    .filter(Boolean);

const unsupportedClaimsFromModel =
  Array.isArray(result.unsupported_claims)
    ? result.unsupported_claims
        .map(value => String(value).trim())
        .filter(Boolean)
    : [];

const unsupportedClaims =
  [...new Set([
    ...unsupportedClaimsFromChecks,
    ...unsupportedClaimsFromModel
  ])];

const requiredCorrections =
  Array.isArray(result.required_corrections)
    ? result.required_corrections
        .map(value => String(value).trim())
        .filter(Boolean)
    : [];

let verification = result.verification;

if (
  verification === 'PASS' &&
  unsupportedClaims.length > 0
) {
  verification = 'REVISE';
}

const hasInvalidCitation =
  citationChecks.some(
    citation =>
      citation.valid !== true ||
      citation.supports_answer !== true
  );

if (
  verification === 'PASS' &&
  hasInvalidCitation
) {
  verification = 'REVISE';
}

return [{
  json: {
    ...context,
    citation_verification: verification,
    verification,
    citation_verification_confidence: confidence,
    groundedness_score: roundScore(groundednessScore),
    citation_correctness_score: roundScore(citationCorrectnessScore),
    total_claims: totalClaims,
    supported_claims_count: supportedClaimsCount,
    unsupported_claims_count: totalClaims - supportedClaimsCount,
    total_citations: totalCitations,
    valid_supporting_citations: validSupportingCitations,
    needs_revision: verification === 'REVISE',
    needs_human_review: verification === 'NEEDS_HUMAN_REVIEW',
    citation_verification_reason: String(result.reason || '').trim(),
    claim_verifications: claimVerifications,
    citation_checks: citationChecks,
    unsupported_claims: unsupportedClaims,
    required_corrections: requiredCorrections,
    model_reported_groundedness_score:
      Number(result.groundedness_score || 0),
    model_reported_citation_correctness_score:
      Number(result.citation_correctness_score || 0)
  }
}];
