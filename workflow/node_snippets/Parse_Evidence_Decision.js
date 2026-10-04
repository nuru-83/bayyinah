// Bayyinah | Parse Evidence Decision (zero-based indexes only)
const input=$input.first().json;
let raw=String(input.text||input.output||'').replace(/```json/gi,'').replace(/```/g,'').trim();
let decision; try{decision=JSON.parse(raw);}catch(e){throw new Error('تعذر قراءة قرار Evidence Judge كـ JSON.\n\nالناتج:\n'+raw);}
const allowed=['SUPPORTED','NEEDS_EXTERNAL_SEARCH','NEEDS_HUMAN_REVIEW'];
if(!allowed.includes(decision.decision)) throw new Error('قيمة decision غير صحيحة: '+decision.decision);
const expectedFlags={SUPPORTED:{evidence_sufficient:true,needs_external_search:false,needs_human_review:false},NEEDS_EXTERNAL_SEARCH:{evidence_sufficient:false,needs_external_search:true,needs_human_review:false},NEEDS_HUMAN_REVIEW:{evidence_sufficient:false,needs_external_search:false,needs_human_review:true}};
let retrievalData={}; try{retrievalData=$('Evaluate Retrieval Sufficiency').first().json;}catch(e){}
const allEvidence=Array.isArray(retrievalData.evidence)?retrievalData.evidence:[];
const recommendedIndexes=[...new Set((Array.isArray(decision.recommended_evidence_indexes)?decision.recommended_evidence_indexes:[]).map(Number).filter(i=>Number.isInteger(i)&&i>=0&&i<allEvidence.length))];
let selectedEvidence=recommendedIndexes.map(i=>allEvidence[i]).filter(Boolean);
if(decision.decision==='SUPPORTED'&&!selectedEvidence.length) selectedEvidence=allEvidence;
let confidence=Number(decision.confidence); if(!Number.isFinite(confidence)) confidence=0; confidence=Math.max(0,Math.min(1,confidence));
const expected=expectedFlags[decision.decision];
return [{json:{evidence_sufficient:expected.evidence_sufficient,confidence,decision:decision.decision,needs_external_search:expected.needs_external_search,needs_human_review:expected.needs_human_review,reason:decision.reason||'',supported_points:Array.isArray(decision.supported_points)?decision.supported_points:[],missing_points:Array.isArray(decision.missing_points)?decision.missing_points:[],recommended_evidence_indexes:recommendedIndexes,combined_evidence:selectedEvidence,all_retrieved_evidence:allEvidence,best_score:Number(retrievalData.best_score||0),retrieved_count:Number(retrievalData.retrieved_count||0),usable_count:Number(retrievalData.usable_count||0)}}];
