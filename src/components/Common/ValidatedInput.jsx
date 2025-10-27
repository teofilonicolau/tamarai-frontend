// src/components/Common/ValidatedInput.jsx
import React, { useEffect, useState } from 'react';
import { masks } from '../../utils/masks';

/**
 * ValidatedInput
 * Props:
 * - label, name, value, onChange (recebe string), onBlur (chama quando perde foco),
 * - error, touched, mask (nome da máscara em masks), placeholder, type, required, disabled, icon, helpText
 *
 * Comportamento:
 * - mantém estado interno displayValue para permitir digitação fluida com máscara
 * - chama onChange(rawValue) sempre que o usuário digita (raw = sem máscara / numérico para money)
 * - chama onBlur() somente no blur
 * - mostra erro somente se touched === true && error
 */
const ValidatedInput = ({
  label,
  name,
  type = 'text',
  value = '',
  onChange = () => {},
  onBlur = () => {},
  error,
  touched,
  mask,
  placeholder,
  required = false,
  disabled = false,
  icon,
  helpText,
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState('');

  // Aplica máscara para exibição (quando apropriado). Para type="date" mantemos value como vem.
  useEffect(() => {
    if (type === 'date') {
      setDisplayValue(value || '');
      return;
    }

    if (value === undefined || value === null) {
      setDisplayValue('');
      return;
    }

    const str = String(value);

    if (mask && masks[mask]) {
      try {
        setDisplayValue(masks[mask](str));
      } catch {
        setDisplayValue(str);
      }
    } else {
      setDisplayValue(str);
    }
  }, [value, mask, type]);

  const toRaw = (val) => {
    // Converte displayValue em forma "raw" esperada pelo pai
    if (val === undefined || val === null) return '';

    const s = String(val);

    if (type === 'date') {
      // date input dá o formato ISO local yyyy-mm-dd
      return s;
    }

    if (mask === 'onlyNumbers') {
      return s.replace(/\D/g, '');
    }

    if (mask === 'money') {
      // Remove tudo que não é dígito, vírgula ou ponto
      let cleaned = s.replace(/[^\d,.-]/g, '');
      if (cleaned.indexOf('.') > -1 && cleaned.indexOf(',') > -1) {
        // assume '.' milhares e ',' decimal
        cleaned = cleaned.replace(/\./g, '').replace(',', '.');
      } else {
        // transforma vírgula decimal em ponto
        cleaned = cleaned.replace(',', '.');
      }
      // Remover múltiplos pontos extras (deixa o primeiro)
      const parts = cleaned.split('.');
      if (parts.length > 2) {
        cleaned = parts.slice(0, -1).join('') + '.' + parts[parts.length - 1];
      }
      return cleaned;
    }

    // Para CPF, telefone etc. enviamos o valor "visível" (podemos remover espaços extras)
    return s.trim();
  };

  const handleChange = (e) => {
    // Para inputs nativos de date, usar value direto
    if (type === 'date') {
      const v = e.target.value;
      setDisplayValue(v);
      onChange(v);
      return;
    }

    const next = e.target.value;
    setDisplayValue(next);

    const raw = toRaw(next);
    onChange(raw);
  };

  const handleBlur = () => {
    // apenas notifica o pai que houve blur; o pai (useValidation) chamará setFieldTouched pelo seu wrapper
    onBlur();
  };

  const showError = Boolean(touched && error);
  const showValid = Boolean(touched && !error && value);

  return (
    <div style={{ marginBottom: '12px' }}>
      {label && (
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, color: '#495057' }}>
          {icon && <span style={{ marginRight: 8 }}>{icon}</span>}
          {label} {required ? <span style={{ color: '#dc3545' }}>*</span> : null}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          name={name}
          type={type === 'date' ? 'date' : 'text'}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: 8,
            border: showError ? '2px solid #dc3545' : '2px solid #dee2e6',
            backgroundColor: disabled ? '#f8f9fa' : 'white',
            color: disabled ? '#6c757d' : '#495057',
            fontSize: '1em',
            boxSizing: 'border-box',
            outline: 'none'
          }}
          {...props}
        />

        {showError && (
          <div style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#dc3545',
            fontSize: '1.1em'
          }}>
            ❌
          </div>
        )}

        {showValid && (
          <div style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#28a745',
            fontSize: '1.1em'
          }}>
            ✅
          </div>
        )}
      </div>

      {showError && (
        <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '6px', display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 6 }}>⚠️</span>
          {error}
        </div>
      )}

      {helpText && !showError && (
        <div style={{ fontSize: '0.9em', color: '#6c757d', marginTop: '6px', fontStyle: 'italic' }}>
          💡 {helpText}
        </div>
      )}
    </div>
  );
};

export default ValidatedInput;