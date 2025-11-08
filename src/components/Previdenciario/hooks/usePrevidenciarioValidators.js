// src/components/Previdenciario/hooks/usePrevidenciarioValidators.js
import { validators } from '../../../utils/validations';
import { normalizePayload } from '../../../utils/payload';

// helper: remove não dígitos
export const onlyDigits = (v) => (v == null ? '' : String(v).replace(/\D/g, ''));

// função que valida CPF/CNPJ já normalizado
export function validateCpfOrCnpj(value) {
  const clean = onlyDigits(value);
  if (!clean) return false;
  if (clean.length === 11) return validators.cpf(clean);
  if (clean.length === 14) return validators.cnpj(clean);
  return false;
}

// export padrão
export default function usePrevidenciarioValidators() {
  return {
    onlyDigits,
    validateCpfOrCnpj,
    validators,
    normalizePayload,
  };
}