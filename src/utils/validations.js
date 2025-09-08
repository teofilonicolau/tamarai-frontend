// C:\Users\Samsung\Desktop\tamaruse-frontend\src\utils\validations.js - ATUALIZADO
// Validações para formulários

// Funções existentes mantidas para compatibilidade
export const validarCPF = (cpf) => {
  const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  return regex.test(cpf);
};

export const validarCNPJ = (cnpj) => {
  const regex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
  return regex.test(cnpj);
};

export const formatarCPF = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const camposObrigatorios = {
  'aposentadoria-invalidez': ['nome', 'cpf', 'informacoes_medicas', 'cid_principal'],
  'aposentadoria-especial': ['nome', 'cpf', 'atividade_especial'],
  'bpc-loas': ['nome', 'cpf', 'renda_familiar'],
  // ... outros tipos
};

// NOVAS VALIDAÇÕES AVANÇADAS ADICIONADAS
export const validators = {
  // Validação de CPF com dígitos verificadores
  cpf: (cpf) => {
    const cleanCpf = cpf.replace(/\D/g, '');
    
    if (cleanCpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleanCpf)) return false; // Números iguais
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.charAt(10))) return false;
    
    return true;
  },

  // Validação de CNPJ com dígitos verificadores
  cnpj: (cnpj) => {
    const cleanCnpj = cnpj.replace(/\D/g, '');
    
    if (cleanCnpj.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cleanCnpj)) return false;
    
    let length = cleanCnpj.length - 2;
    let numbers = cleanCnpj.substring(0, length);
    let digits = cleanCnpj.substring(length);
    let sum = 0;
    let pos = length - 7;
    
    for (let i = length; i >= 1; i--) {
      sum += numbers.charAt(length - i) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(0))) return false;
    
    length = length + 1;
    numbers = cleanCnpj.substring(0, length);
    sum = 0;
    pos = length - 7;
    
    for (let i = length; i >= 1; i--) {
      sum += numbers.charAt(length - i) * pos--;
      if (pos < 2) pos = 9;
    }
    
    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(1))) return false;
    
    return true;
  },

  // Validação de email
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validação de telefone
  telefone: (telefone) => {
    const cleanTelefone = telefone.replace(/\D/g, '');
    return cleanTelefone.length === 10 || cleanTelefone.length === 11;
  },

  // Validação de CEP
  cep: (cep) => {
    const cleanCep = cep.replace(/\D/g, '');
    return cleanCep.length === 8;
  },

  // Validação de data
  data: (data) => {
    if (!data) return false;
    const dataObj = new Date(data);
    const hoje = new Date();
    return dataObj <= hoje && dataObj.getFullYear() >= 1900;
  },

  // Validação de valor monetário
  valorMonetario: (valor, min = 0, max = 999999999) => {
    const numericValue = parseFloat(valor);
    return !isNaN(numericValue) && numericValue >= min && numericValue <= max;
  },

  // Validação de PIS/PASEP
  pis: (pis) => {
    const cleanPis = pis.replace(/\D/g, '');
    if (cleanPis.length !== 11) return false;
    
    const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanPis.charAt(i)) * weights[i];
    }
    
    const remainder = sum % 11;
    const digit = remainder < 2 ? 0 : 11 - remainder;
    
    return digit === parseInt(cleanPis.charAt(10));
  }
};