// Hook / helper para integrar validações CPF / CPF-CNPJ com react-hook-form
// Uso: const { cpfRegister, cpfCnpjRegister } = useFormValidators({ required: true });
// then: <input {...register('cpf', cpfRegister)} />

import { validators } from '../utils/validations';

const onlyDigits = (v) => (v == null ? '' : String(v).replace(/\D/g, ''));

export function useFormValidators(opts = {}) {
  // opts: { required: boolean | string }
  const requiredOption = opts.required === true ? 'Campo obrigatório' : (typeof opts.required === 'string' ? opts.required : false);

  const cpfRegister = {
    required: requiredOption,
    setValueAs: (v) => (v ? onlyDigits(v) : ''),
    validate: (v) => {
      if (!v) return !requiredOption || true;
      return validators.cpf(v) || 'CPF inválido (insira 11 dígitos válidos)';
    }
  };

  const cpfCnpjRegister = {
    setValueAs: (v) => (v ? onlyDigits(v) : ''),
    validate: (v) => {
      if (!v) return true;
      if (v.length === 11) return validators.cpf(v) || 'CPF inválido';
      if (v.length === 14) return validators.cnpj(v) || 'CNPJ inválido';
      return 'Informe 11 (CPF) ou 14 (CNPJ) dígitos';
    }
  };

  return { cpfRegister, cpfCnpjRegister, onlyDigits };
}

export default useFormValidators;