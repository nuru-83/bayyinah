// ==========================================================
// Bayyinah | Prepare Jina Qdrant Points
// تجهيز كل Chunk + Jina Embedding كنقطة جاهزة لـ Qdrant
// Production Hardened Version
// ==========================================================

const items = $input.all();

const EXPECTED_VECTOR_SIZE = 1024;
const EXPECTED_PROVIDER = 'jina';
const EXPECTED_MODEL = 'jina-embeddings-v3';
const EXPECTED_TASK_TYPE = 'retrieval.passage';

if (!items.length) {
  return [];
}

const results = [];
const seenPointIdentities = new Set();
const seenPointIds = new Set();


// ==========================================================
// إنشاء UUID ثابت Deterministic
// الهوية = document_id + chunk_id
// ==========================================================

function createDeterministicUuid(input) {

  const text = String(input);

  let h1 = 0xdeadbeef ^ text.length;
  let h2 = 0x41c6ce57 ^ text.length;
  let h3 = 0xc0decafe ^ text.length;
  let h4 = 0x1234567 ^ text.length;

  for (let i = 0; i < text.length; i++) {

    const ch = text.charCodeAt(i);

    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
    h3 = Math.imul(h3 ^ ch, 2246822507);
    h4 = Math.imul(h4 ^ ch, 3266489909);
  }

  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);

  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h3 ^ (h3 >>> 13), 3266489909);

  h3 =
    Math.imul(h3 ^ (h3 >>> 16), 2246822507) ^
    Math.imul(h4 ^ (h4 >>> 13), 3266489909);

  h4 =
    Math.imul(h4 ^ (h4 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  const hex =
    (h1 >>> 0).toString(16).padStart(8, '0') +
    (h2 >>> 0).toString(16).padStart(8, '0') +
    (h3 >>> 0).toString(16).padStart(8, '0') +
    (h4 >>> 0).toString(16).padStart(8, '0');

  return (
    hex.slice(0, 8) + '-' +
    hex.slice(8, 12) + '-' +
    '4' + hex.slice(13, 16) + '-' +
    '8' + hex.slice(17, 20) + '-' +
    hex.slice(20, 32)
  );
}


// ==========================================================
// معالجة جميع Chunks
// ==========================================================

for (let i = 0; i < items.length; i++) {

  const item = items[i].json || {};

  // ========================================================
  // 1) التحقق من Jina Vector
  // ========================================================

  const vector = item.embedding;

  if (!Array.isArray(vector)) {
    throw new Error(
      `لم يتم العثور على embedding صالح في العنصر رقم ${i + 1}.`
    );
  }

  if (vector.length !== EXPECTED_VECTOR_SIZE) {
    throw new Error(
      `حجم Jina Vector غير صحيح في العنصر رقم ${i + 1}: ` +
      `${vector.length} بدلاً من ${EXPECTED_VECTOR_SIZE}.`
    );
  }

  const hasInvalidVectorValue = vector.some(
    value =>
      typeof value !== 'number' ||
      !Number.isFinite(value)
  );

  if (hasInvalidVectorValue) {
    throw new Error(
      `يحتوي Jina Vector على قيمة غير رقمية أو غير صالحة ` +
      `في العنصر رقم ${i + 1}.`
    );
  }


  // ========================================================
  // 2) التحقق من Embedding Lineage
  // ========================================================

  const embeddingMetadata =
    item.embedding_metadata &&
    typeof item.embedding_metadata === 'object'
      ? item.embedding_metadata
      : {};

  const provider =
    String(
      embeddingMetadata.provider ||
      EXPECTED_PROVIDER
    ).trim();

  const model =
    String(
      embeddingMetadata.model ||
      EXPECTED_MODEL
    ).trim();

  const dimensions =
    Number(
      embeddingMetadata.dimensions ??
      EXPECTED_VECTOR_SIZE
    );

  const taskType =
    String(
      embeddingMetadata.task_type ||
      EXPECTED_TASK_TYPE
    ).trim();

  if (provider !== EXPECTED_PROVIDER) {
    throw new Error(
      `Embedding provider غير صحيح في العنصر ${i + 1}: ` +
      `"${provider}" بدلاً من "${EXPECTED_PROVIDER}".`
    );
  }

  if (model !== EXPECTED_MODEL) {
    throw new Error(
      `Embedding model غير صحيح في العنصر ${i + 1}: ` +
      `"${model}" بدلاً من "${EXPECTED_MODEL}".`
    );
  }

  if (dimensions !== EXPECTED_VECTOR_SIZE) {
    throw new Error(
      `Embedding dimensions غير صحيحة في العنصر ${i + 1}: ` +
      `${dimensions} بدلاً من ${EXPECTED_VECTOR_SIZE}.`
    );
  }

  if (taskType !== EXPECTED_TASK_TYPE) {
    throw new Error(
      `Embedding task_type غير صحيح في العنصر ${i + 1}: ` +
      `"${taskType}" بدلاً من "${EXPECTED_TASK_TYPE}".`
    );
  }


  // ========================================================
  // 3) قراءة Chunk
  // ========================================================

  const chunkId =
    String(item.id || '').trim();

  if (!chunkId) {
    throw new Error(
      `لا يوجد id للـ Chunk في العنصر رقم ${i + 1}.`
    );
  }

  const content =
    String(item.text || '').trim();

  if (!content) {
    throw new Error(
      `النص فارغ في الـ Chunk: ${chunkId}`
    );
  }


  // ========================================================
  // 4) Metadata
  // ========================================================

  const metadata =
    item.metadata &&
    typeof item.metadata === 'object'
      ? item.metadata
      : {};

  const documentId =
    String(metadata.document_id || '').trim();

  if (!documentId) {
    throw new Error(
      `document_id مفقود في الـ Chunk: ${chunkId}`
    );
  }

  const sourceTitle =
    String(metadata.source_title || '').trim();

  if (!sourceTitle) {
    throw new Error(
      `source_title مفقود في الـ Chunk: ${chunkId}`
    );
  }

  const sourceType =
    String(metadata.source_type || 'book').trim();

  const language =
    String(metadata.language || 'ar').trim();

  const pdfPages =
    Array.isArray(metadata.pdf_pages)
      ? metadata.pdf_pages
      : [];

  const printedPages =
    Array.isArray(metadata.printed_pages)
      ? metadata.printed_pages
      : [];


  // ========================================================
  // 5) الهوية المركبة للنقطة
  // ========================================================

  const pointIdentity =
    `${documentId}::${chunkId}`;

  if (seenPointIdentities.has(pointIdentity)) {
    throw new Error(
      `تم اكتشاف point_identity مكرر: ${pointIdentity}`
    );
  }

  seenPointIdentities.add(pointIdentity);


  // ========================================================
  // 6) UUID ثابت
  // ========================================================

  const pointId =
    createDeterministicUuid(pointIdentity);

  if (seenPointIds.has(pointId)) {
    throw new Error(
      `تم اكتشاف point_id مكرر: ${pointId} ` +
      `للهوية ${pointIdentity}`
    );
  }

  seenPointIds.add(pointId);


  // ========================================================
  // 7) إنشاء Qdrant Point
  // ========================================================

  results.push({

    json: {

      point_id:
        pointId,

      point_identity:
        pointIdentity,

      document_id:
        documentId,

      chunk_id:
        chunkId,

      vector,

      payload: {

        // المحتوى
        content,

        // هوية المصدر
        document_id:
          documentId,

        work_id:
          metadata.work_id || '',

        source_title:
          sourceTitle,

        source_type:
          sourceType,

        author:
          metadata.author || '',

        language:
          language,

        // بنية الكتاب
        unit_type:
          metadata.unit_type || '',

        unit_number:
          metadata.unit_number ?? null,

        question:
          metadata.question || '',

        issue_number:
          metadata.issue_number ?? null,

        issue_title:
          metadata.issue_title || '',

        section_title:
          metadata.section_title ||
          metadata.issue_title ||
          '',

        // الصفحات
        pdf_pages:
          pdfPages,

        printed_pages:
          printedPages,

        page_start:
          metadata.page_start ??
          (
            printedPages.length
              ? printedPages[0]
              : (
                  pdfPages.length
                    ? pdfPages[0]
                    : null
                )
          ),

        page_end:
          metadata.page_end ??
          (
            printedPages.length
              ? printedPages[printedPages.length - 1]
              : (
                  pdfPages.length
                    ? pdfPages[pdfPages.length - 1]
                    : null
                )
          ),

        // هوية Chunk
        chunk_id:
          chunkId,

        point_identity:
          pointIdentity,

        chunk_index:
          metadata.chunk_index ?? null,

        total_chunks_in_unit:
          metadata.total_chunks_in_unit ?? null,

        parent_id:
          metadata.parent_id || '',

        // Google Drive Lineage
        drive_file_id:
          metadata.drive_file_id || '',

        drive_file_name:
          metadata.drive_file_name || '',

        // Lineage / Processing
        dataset:
          metadata.dataset || '',

        processing_version:
          metadata.processing_version || '',

        rag_ready:
          metadata.rag_ready ?? true,

        docling_refs:
          Array.isArray(metadata.docling_refs)
            ? metadata.docling_refs
            : [],

        // Jina Embedding Lineage
        embedding_provider:
          EXPECTED_PROVIDER,

        embedding_model:
          EXPECTED_MODEL,

        embedding_dimensions:
          EXPECTED_VECTOR_SIZE,

        embedding_task_type:
          EXPECTED_TASK_TYPE,

        // سياسات جودة المصدر
        has_special_quran_glyphs:
          metadata.has_special_quran_glyphs ?? false,

        quran_special_font_policy:
          metadata.quran_special_font_policy || ''
      }
    }
  });
}


// ==========================================================
// 8) التحقق النهائي
// ==========================================================

if (results.length !== items.length) {
  throw new Error(
    `فشل التحقق النهائي في Prepare Jina Qdrant Points: ` +
    `المدخلات=${items.length}، النتائج=${results.length}.`
  );
}

return results;