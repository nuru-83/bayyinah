# Improvement plan | خطة التحسين بعد تثبيت RAG

أصبح المسار الأساسي يعمل End-to-End. الأولوية الآن ليست إضافة مزيد من العقد بلا قياس، بل تحسين الموثوقية وإثباتها.

## الأولوية 1 — Citation Verification
الهدف: التأكد أن الصفحة/المصدر المستشهد به يدعم فعلًا الادعاء المستخدم في الجواب، لا مجرد أنه استُرجع مع السؤال.

المخرج المطلوب لكل جواب:
- `citation_verified`
- الادعاءات المدعومة وغير المدعومة
- evidence index المستخدم لكل ادعاء
- سبب الفشل إن وُجد
- قرار: PASS / RETRY / HUMAN_REVIEW

## الأولوية 2 — Query Rewriting / Retrieval Retry
إذا فشل Citation Verification أو كانت الأدلة غير كافية:
1. يولد النظام query بديلة أكثر تحديدًا.
2. يعيد الاسترجاع مرة واحدة فقط.
3. يعيد Evidence Judge.
4. إذا استمر النقص ينتقل إلى المصادر الخارجية أو المراجع البشري.

الهدف: رفع retrieval rescue rate دون الدخول في loop غير محدود.

## الأولوية 3 — Benchmark baseline
إنشاء مجموعة صغيرة من الأسئلة المرجعية، تشمل:
- أسئلة لها جواب مباشر في «بصائر».
- أسئلة تحتاج أكثر من chunk.
- أسئلة لا يغطيها الكتاب ويجب أن تؤدي إلى external search أو abstention.
- أسئلة حساسة ينبغي تصعيدها.

المقاييس الأولية:
- Retrieval hit rate
- Citation correctness
- Groundedness / faithfulness
- Correct abstention
- External-search rate
- Human-review escalation rate
- Latency
- Cost

## الأولوية 4 — Groundedness & Abstention
إضافة تقييم مستقل يحدد:
- هل كل ادعاء جوهري في الجواب مدعوم بالدليل؟
- هل كان ينبغي على النظام الامتناع بدل الإجابة؟

## الأولوية 5 — Claim-level grounding أو Evidence-gap recovery
بعد استقرار المقاييس، نختار تحسينًا واحدًا فقط:
- ربط كل claim بالدليل الذي يدعمه، أو
- اكتشاف فجوة الدليل والبحث فقط عن الجزء الناقص.

## الأولوية 6 — Evidence Ledger
سجل قابل للمراجعة يحفظ لكل إجابة:
- السؤال
- الأدلة المسترجعة
- الأدلة المختارة
- قرار Evidence Judge
- الاستشهادات
- نتيجة Citation Verification
- هل حدث retry أو external search أو human review

## الأولوية 7 — العرض والتسليم
- مقارنة Before/After بالأرقام.
- تحديث README والـWorkflow sanitized.
- فيديو ≤ 2 دقيقة.
- عرض اللجنة النهائي.

**مبدأ التنفيذ:** 3 تحسينات مكتملة وقابلة للقياس أفضل من 8 ميزات نصف مكتملة.
