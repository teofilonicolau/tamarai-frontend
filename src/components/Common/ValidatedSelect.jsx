// src/components/Common/ValidatedSelect.jsx
import React from 'react';

const ValidatedSelect = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  options,
  placeholder = 'Selecione...',
  required = false,
  disabled = false,
  icon,
  helpText,
  ...props
}) => {
  const handleChange = (e) => {
    onChange(name, e.target.value);
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
        <select
          name={name}
          value={value || ''}
          onChange={handleChange}
          onBlur={handleBlur}
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
            boxSizing: 'border-box',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            backgroundSize: '16px',
            paddingRight: '40px'
          }}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {hasError && (
          <div style={{
            position: 'absolute',
            right: '35px',
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
            right: '35px',
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

export default ValidatedSelect;