export const normalizePayload = (data) => {
  const result = {};

  const isNumericString = (v) => typeof v === 'string' && /^[\d.,-]+\s*$/.test(v);

  Object.entries(data || {}).forEach(([key, value]) => {
    // Strings
    if (typeof value === 'string') {
      const trimmed = value.trim();

      // Remove máscaras de CPF/CNPJ
      if (key.toLowerCase().includes('cpf') || key.toLowerCase().includes('cnpj')) {
        result[key] = trimmed.replace(/\D/g, '');
      }
      // Converte datas para ISO (YYYY-MM-DD) - includes common keys
      else if (
        key.toLowerCase().includes('data') ||
        key.toLowerCase().includes('periodo') ||
        key.toLowerCase() === 'der' ||
        key.toLowerCase() === 'dib' ||
        key.toLowerCase().includes('nascimento')
      ) {
        if (!trimmed) {
          result[key] = null;
        } else {
          try {
            // detect dd/mm/yyyy
            const dmY = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);
            const candidate = dmY ? `${dmY[3]}-${dmY[2]}-${dmY[1]}` : trimmed;
            const d = new Date(candidate);
            if (Number.isNaN(d.getTime())) {
              result[key] = null;
            } else {
              result[key] = d.toISOString().split('T')[0];
            }
          } catch (err) {
            console.warn('normalizePayload: date parse error for key', key, 'value', trimmed, err);
            result[key] = null;
          }
        }
      }
      // Numeric-like strings for monetary/valor fields
      else if (
        isNumericString(trimmed) &&
        (key.toLowerCase().includes('valor') ||
          key.toLowerCase().includes('salario') ||
          key.toLowerCase().includes('prejuizo') ||
          key.toLowerCase().includes('causa') ||
          key.toLowerCase().includes('tempo'))
      ) {
        // Normalize common formats: "R$ 1.234,56" or "1,234.56"
        let s = trimmed.replace(/[^\d.,-]/g, '');
        if (s.indexOf('.') > -1 && s.indexOf(',') > -1) {
          s = s.replace(/\./g, '').replace(',', '.');
        } else {
          s = s.replace(',', '.');
        }
        const n = parseFloat(s);
        result[key] = Number.isNaN(n) ? null : n;
      }
      // Treat empty string as null
      else {
        result[key] = trimmed === '' ? null : trimmed;
      }
    }
    // Numbers
    else if (typeof value === 'number') {
      result[key] = Number.isNaN(value) ? null : value;
    }
    // Booleans
    else if (typeof value === 'boolean') {
      result[key] = value;
    }
    // Arrays
    else if (Array.isArray(value)) {
      // Ensure array items are strings and trimmed; keep non-empty entries
      result[key] = value
        .map((item) =>
          typeof item === 'string' ? item.trim() : item === null || item === undefined ? '' : String(item).trim()
        )
        .filter((item) => item !== '');
    }
    // Null / undefined / objects
    else {
      result[key] = value === undefined ? null : value;
    }
  });

  return result;
};

export const extractPayload = (data) => {
  // Função para extrair apenas campos preenchidos (remove undefined/null/empty string)
  return Object.fromEntries(
    Object.entries(data || {}).filter(([, value]) => value !== undefined && value !== null && value !== '')
  );
};