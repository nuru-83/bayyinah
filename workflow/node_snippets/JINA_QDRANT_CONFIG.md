# Jina / Qdrant current node configuration

## Jina document embedding
POST `https://api.jina.ai/v1/embeddings`

```js
{{ JSON.stringify({
  model: "jina-embeddings-v3",
  task: "retrieval.passage",
  dimensions: 1024,
  input: $json.texts
}) }}
```

Batch interval used after TPM error: `10000 ms`.

## Jina query embedding
The live node may still have the legacy name `Cohere Query Embedding - Production` to avoid breaking references.

```js
{{ JSON.stringify({
  model: "jina-embeddings-v3",
  task: "retrieval.query",
  dimensions: 1024,
  input: [$json.question]
}) }}
```

## Attach Request Context
Add `query_embedding` (Array):

```js
{{ $json.data[0].embedding }}
```

## Qdrant search
Endpoint template:
`https://<QDRANT_HOST>/collections/bayyinah_jina_v1/points/query`

```js
{{ JSON.stringify({
  query: $json.query_embedding,
  using: "dense",
  limit: 5,
  with_payload: true,
  with_vector: false
}) }}
```

## Qdrant upsert
Endpoint template:
`https://<QDRANT_HOST>/collections/bayyinah_jina_v1/points?wait=true`

```js
{{ JSON.stringify({ points: $json.points }) }}
```
