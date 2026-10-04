// Bayyinah | Build Qdrant Batches
const items = $input.all();
if (!items.length) return [];
const BATCH_SIZE = 10;
const EXPECTED_VECTOR_SIZE = 1024;
const output = [];
for (let start = 0; start < items.length; start += BATCH_SIZE) {
  const batchItems = items.slice(start, start + BATCH_SIZE);
  const points = [];
  for (let i = 0; i < batchItems.length; i++) {
    const item = batchItems[i].json || {};
    const pointId = String(item.point_id || '').trim();
    const vector = item.vector;
    const payload = item.payload && typeof item.payload === 'object' ? item.payload : null;
    if (!pointId) throw new Error(`point_id مفقود في العنصر رقم ${start + i + 1}.`);
    if (!Array.isArray(vector)) throw new Error(`Vector غير صالح للنقطة: ${pointId}`);
    if (vector.length !== EXPECTED_VECTOR_SIZE) throw new Error(`حجم Vector غير صحيح للنقطة ${pointId}: ${vector.length} بدلاً من ${EXPECTED_VECTOR_SIZE}.`);
    if (vector.some(value => typeof value !== 'number' || !Number.isFinite(value))) throw new Error(`Vector يحتوي على قيمة غير صالحة للنقطة: ${pointId}`);
    if (!payload) throw new Error(`Payload مفقود للنقطة: ${pointId}`);
    points.push({ id: pointId, vector: { dense: vector }, payload });
  }
  output.push({ json: { batch_index: Math.floor(start / BATCH_SIZE), batch_size: points.length, points } });
}
const totalPoints = output.reduce((sum,batch)=>sum+batch.json.points.length,0);
if (totalPoints !== items.length) throw new Error(`عدم تطابق عدد نقاط Qdrant: المدخلات=${items.length}، المجهزة=${totalPoints}.`);
return output;
