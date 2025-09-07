// src/components/Calculadoras/ProgressBar.jsx
import React from 'react';

const ProgressBar = ({ 
  atual, 
  meta, 
  label, 
  color = '#007bff',
  height = '12px',
  showPercentage = true,
  animated = false 
}) => {
  const percentage = Math.min(100, Math.max(0, (atual / meta) * 100));
  
  return (
    <div style={{ width: '100%', marginBottom: '10px' }}>
      {label && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '5px',
          fontSize: '0.9em',
          color: '#495057'
        }}>
          <span>{label}</span>
          {showPercentage && (
            <span style={{ fontWeight: 'bold' }}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div style={{
        background: '#e9ecef',
        borderRadius: height,
        height: height,
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          background: percentage >= 100 ? '#28a745' : color,
          height: '100%',
          width: `${percentage}%`,
          borderRadius: height,
          transition: animated ? 'width 0.8s ease-in-out' : 'none',
          position: 'relative'
        }}>
          {animated && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              background: 'linear-gradient(45deg, transparent 33%, rgba(255,255,255,0.3) 33%, rgba(255,255,255,0.3) 66%, transparent 66%)',
              backgroundSize: '20px 20px'
            }} />
          )}
        </div>
      </div>
      
      <div style={{ 
        fontSize: '0.8em', 
        color: '#6c757d', 
        marginTop: '3px',
        textAlign: 'center'
      }}>
        {atual} de {meta} {percentage >= 100 ? '✅' : '⏳'}
      </div>
    </div>
  );
};

export default ProgressBar;