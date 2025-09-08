// C:\Users\Samsung\Desktop\tamaruse-frontend\src\hooks\useValidation.js
import { useState, useCallback } from 'react';

export const useValidation = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((fieldName, value) => {
    const rules = validationRules[fieldName];
    if (!rules) return '';

    for (const rule of rules) {
      if (rule.required && (!value || value.toString().trim() === '')) {
        return rule.message || `${fieldName} é obrigatório`;
      }

      if (value && rule.validator && !rule.validator(value)) {
        return rule.message || `${fieldName} é inválido`;
      }

      if (value && rule.min && parseFloat(value) < rule.min) {
        return rule.message || `${fieldName} deve ser maior que ${rule.min}`;
      }

      if (value && rule.max && parseFloat(value) > rule.max) {
        return rule.message || `${fieldName} deve ser menor que ${rule.max}`;
      }

      if (value && rule.minLength && value.toString().length < rule.minLength) {
        return rule.message || `${fieldName} deve ter pelo menos ${rule.minLength} caracteres`;
      }

      if (value && rule.maxLength && value.toString().length > rule.maxLength) {
        return rule.message || `${fieldName} deve ter no máximo ${rule.maxLength} caracteres`;
      }
    }

    return '';
  }, [validationRules]);

  const setValue = useCallback((fieldName, value) => {
    setValues(prev => ({ ...prev, [fieldName]: value }));
    
    if (touched[fieldName]) {
      const error = validateField(fieldName, value);
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  }, [touched, validateField]);

  const setFieldTouched = useCallback((fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const error = validateField(fieldName, values[fieldName]);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  }, [values, validateField]);

  const validateAll = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName]);
      newErrors[fieldName] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {}));

    return isValid;
  }, [values, validationRules, validateField]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateAll,
    resetForm,
    isValid: Object.values(errors).every(error => !error)
  };
};