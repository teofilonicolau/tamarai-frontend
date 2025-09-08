// src/components/Common/ValidatedInput.jsx
import React from 'react';
import { masks } from '../../utils/masks';

const ValidatedInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
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
  const handleChange = (e) => {
    let newValue = e.target.value;
    
    // Aplicar máscara se especificada
    if (mask && masks[mask]) {
      newValue = masks[mask](newValue);
    }
    
    onChange(name, newValue);
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur(name);
    }
  };

  const hasError = touched && error;

  return (
    <div style={{ marginBottom: '20px' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontWeight: 'bold',
          color: '#495057'
        }}>
          {icon && <span style={{ marginRight: '8px' }}>{icon}</span>}
          {label}
          {required && <span style={{ color: '#dc3545', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            width: '100%',
            padding: '12px',
            border: `2px solid ${hasError ? '#dc3545' : disabled ? '#e9ecef' : '#dee2e6'}`,
            borderRadius: '8px',
            fontSize: '1em',
            backgroundColor: disabled ? '#f8f9fa' : 'white',
            color: disabled ? '#6c757d' : '#495057',
            transition: 'border-color 0.3s ease',
            outline: 'none',
            boxSizing: 'border-box'
          }}
          {...props}
        />
        
        {hasError && (
          <div style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#dc3545',
            fontSize: '1.2em'
          }}>
            ❌
          </div>
        )}
        
        {!hasError && touched && value && (
          <div style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#28a745',
            fontSize: '1.2em'
          }}>
            ✅
          </div>
        )}
      </div>
      
      {hasError && (
        <div style={{
          color: '#dc3545',
          fontSize: '0.9em',
          marginTop: '5px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ marginRight: '5px' }}>⚠️</span>
          {error}
        </div>
      )}
      
      {helpText && !hasError && (
        <div style={{
          fontSize: '0.9em',
          color: '#6c757d',
          marginTop: '5px',
          fontStyle: 'italic'
        }}>
          💡 {helpText}
        </div>
      )}
    </div>
  );
};

export default ValidatedInput;