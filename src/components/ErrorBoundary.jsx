import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("SYSTEM_CRITICAL_FAILURE:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-overlay">
          <div className="error-content glass-panel">
            <h1 className="glitch" data-text="SYSTEM_CRITICAL_FAILURE">SYSTEM_CRITICAL_FAILURE</h1>
            <div className="error-details">
              <p className="error-code">{" > "} ERROR_HEX: 0xDEADBEEF</p>
              <p className="error-msg">{" > "} {this.state.error?.message || "Unknown neural mismatch detected."}</p>
            </div>
            <button 
              className="retry-button" 
              onClick={() => window.location.reload()}
            >
              INITIATE_SYSTEM_REBOOT
            </button>
          </div>
          <div className="error-scanlines"></div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
