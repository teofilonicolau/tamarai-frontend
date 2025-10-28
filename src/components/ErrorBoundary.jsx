import React from 'react';

/**
 * ErrorBoundary simples para evitar "página em branco" em runtime errors.
 * Envolva sua aplicação com <ErrorBoundary>...</ErrorBoundary> (por exemplo em App.jsx).
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // aqui você pode enviar para um serviço de logging (Sentry, etc.)
    console.error('ErrorBoundary captured error:', error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: 30, maxWidth: 900, margin: '40px auto',
          background: '#fff3cd', border: '1px solid #ffeeba', borderRadius: 8
        }}>
          <h2 style={{ color: '#856404' }}>Ocorreu um erro inesperado</h2>
          <p style={{ color: '#856404' }}>
            Estamos trabalhando para corrigir. Tente recarregar a página. Se o problema persistir, contacte o suporte.
          </p>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: 12 }}>
            {String(this.state.error)}{this.state.info ? '\n\n' + JSON.stringify(this.state.info) : ''}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;