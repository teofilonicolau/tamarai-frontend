export const normalizePayload = (data) => {
  const result = {};

  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'string') {
      // Remove máscaras de CPF/CNPJ
      if (key.includes('cpf') || key.includes('cnpj')) {
        result[key] = value.replace(/\D/g, '');
      }
      // Converte datas para ISO (YYYY-MM-DD)
      else if (key.includes('data_') || key.includes('periodo_')) {
        result[key] = value ? new Date(value).toISOString().split('T')[0] : '';
      }
      // Trata strings vazias como null
      else {
        result[key] = value.trim() === '' ? null : value.trim();
      }
    }
    // Converte números
    else if (typeof value === 'number') {
      result[key] = isNaN(value) ? 0 : value;
    }
    // Mantém booleanos
    else if (typeof value === 'boolean') {
      result[key] = value;
    }
    // Processa arrays
    else if (Array.isArray(value)) {
      result[key] = value.map(item => item.trim()).filter(item => item);
    }
    // Mantém outros tipos (ex.: null, undefined)
    else {
      result[key] = value;
    }
  });

  return result;
};

export const extractPayload = (data) => {
  // Função para extrair apenas campos preenchidos (remove undefined/null)
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined && value !== null && value !== '')
  );
};