import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F9F6F1] flex items-center justify-center px-6">
          <div className="max-w-xl w-full bg-white p-16 rounded-[4rem] shadow-2xl border border-emerald-900/5 text-center space-y-8">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
               <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
            </div>
            <h1 className="text-4xl font-display font-bold text-emerald-950">Something went wrong</h1>
            <p className="text-emerald-900/60 font-medium italic">
              Our heritage experts are looking into this unexpected interruption. Please try refreshing the page.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-12 py-5 bg-emerald-900 text-gold-500 rounded-2xl font-black text-xs tracking-[0.3em] uppercase hover:bg-emerald-950 transition-all shadow-xl shadow-emerald-950/20"
            >
              Refresh Journey
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
