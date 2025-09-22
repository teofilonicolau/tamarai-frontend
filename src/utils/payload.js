
const isEmpty = (v) =>
  v === undefined ||
  v === null ||
  (typeof v === 'string' && v.trim() === '') ||
  (Array.isArray(v) && v.length === 0);

const cleanEmpty = (obj) => {
  const out = {};
  Object.entries(obj || {}).forEach(([k, v]) => {
    if (!isEmpty(v)) out[k] = v;
  });
  return out;
};

// Converte "1.234,56" -> 1234.56; "R$ 1.234,56" -> 1234.56
const parsePtBrNumber = (val) => {
  if (typeof val !== 'string') return val;
  const s = val
    .replace(/\s+/g, '')
    .replace(/R\$\s?/gi, '')
    .replace(/\./g, '')
    .replace(/,/g, '.');
  const n = Number(s);
  return Number.isFinite(n) ? n : val;
};

export const normalizePayload = (payload) => {
  if (!payload || typeof payload !== 'object') return payload;
  const cleaned = cleanEmpty(payload);
  const normalized = {};

  for (const [key, value] of Object.entries(cleaned)) {
    if (typeof value === 'string') {
      // Normaliza números com vírgula
      if (/[0-9]+[,.][0-9]+/.test(value) || /R\$\s*/i.test(value)) {
        normalized[key] = parsePtBrNumber(value);
      } else {
        normalized[key] = value.trim();
      }
    } else if (Array.isArray(value)) {
      normalized[key] = value;
    } else if (value && typeof value === 'object') {
      normalized[key] = normalizePayload(value);
    } else {
      normalized[key] = value;
    }
  }
  return normalized;
};

// Ajuda a extrair apenas campos relevantes (ex.: react-hook-form values)
export const extractPayload = (data) => normalizePayload({ ...data });

export default { normalizePayload, extractPayload };