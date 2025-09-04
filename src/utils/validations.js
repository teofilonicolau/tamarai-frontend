// Validações para formulários
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