# Mentor questions | أسئلة للمرشدين

تم حل Blocker إدخال «بصائر» وتشغيل RAG end-to-end. نحتاج الآن توجيهًا لتحسين المتانة والجودة:

1. ما أفضل pipeline عملي لاستخراج كتب PDF العربية ذات RTL والتشكيل والخطوط القرآنية الخاصة مع page-level citations موثوقة؟
2. هل توصي بتمثيل مزدوج لكل chunk: normalized retrieval text + source-faithful display text؟ وكيف تربط lineage بينهما؟
3. كيف نصمم n8n ingestion checkpoints بحيث لا نعيد Embeddings إذا فشل Qdrant Upsert أو مرحلة لاحقة؟
4. هل نستخدم status لكل كتاب/دفعة مثل: `parsed → qa_passed → embedded → upserted → verified` بدل `processed=true`؟
5. ما الطريقة الصحيحة لترحيل نقاط Cohere القديمة إلى Jina مع منع الـmanifest من تخطي الكتب؟
6. كيف نبني benchmark صغيرًا يضبط Top-K وscore threshold ويقيس citation correctness وgroundedness وabstention؟
7. هل Qdrant dense retrieval وحده مناسب، أم تقترح hybrid retrieval (dense + sparse/BM25) خصوصًا للعناوين العربية والآيات والأسماء؟
8. ما الحد الأدنى من الاختبارات/الأرقام التي تجعل ادعاء «RAG موثوق» مقنعًا أمام لجنة التحكيم؟
9. بعد نجاح التشغيل بفاصل 15 ثانية على Jina، ما أفضل checkpoint/backoff design للإنتاج بدل الاعتماد على interval ثابت؟
