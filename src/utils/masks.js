// C:\Users\Samsung\Desktop\tamaruse-frontend\src\utils\masks.js
export const masks = {
  // Máscara de CPF
  cpf: (value) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  },

  // Máscara de CNPJ
  cnpj: (value) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  },

  // Máscara de telefone
  telefone: (value) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length <= 10) {
      return cleanValue
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    } else {
      return cleanValue
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    }
  },

  // Máscara de CEP
  cep: (value) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  },

  // Máscara de valor monetário
  money: (value) => {
    const cleanValue = value.replace(/\D/g, '');
    const numericValue = parseFloat(cleanValue) / 100;
    
    if (isNaN(numericValue)) return '';
    
    return numericValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  },

  // Máscara de PIS/PASEP
  pis: (value) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{5})(\d)/, '$1.$2')
      .replace(/(\d{2})(\d{1})/, '$1-$2')
      .replace(/(-\d{1})\d+?$/, '$1');
  },

  // Máscara de apenas números
  onlyNumbers: (value) => {
    return value.replace(/\D/g, '');
  },

  // Máscara de porcentagem
  percentage: (value) => {
    const cleanValue = value.replace(/[^\d,]/g, '');
    return cleanValue + '%';
  }
};