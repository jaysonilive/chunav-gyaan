import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false }
  
  static getDerivedStateFromError() { 
    return { hasError: true } 
  }
  
  render() {
    if (this.state.hasError) return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Something went wrong 😔</h2>
        <p>Please refresh the page</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 20px",
            background: "#FF6B00",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "16px"
          }}
        >
          Refresh
        </button>
      </div>
    )
    return this.props.children
  }
}

export default ErrorBoundary;
