import React, { Component } from 'react';
import type { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * React Error Boundary component
 * Catches JavaScript errors anywhere in the component tree and displays a fallback UI
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-tradey-white px-6">
          <div className="max-w-2xl w-full text-center">
            {/* Error Icon */}
            <div className="mb-8">
              <svg
                className="w-24 h-24 mx-auto stroke-tradey-red"
                fill="none"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>

            {/* Title */}
            <h1 className="font-fayte text-5xl md:text-6xl text-tradey-black mb-4 tracking-tight uppercase">
              Ups! Nešto je pošlo po zlu
            </h1>

            {/* Description */}
            <p className="font-sans text-tradey-black/60 text-lg mb-8">
              Došlo je do neočekivane greške. Naš tim je obavešten i radi na rešavanju problema.
            </p>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-8 text-left bg-tradey-black/5 p-6 rounded border border-tradey-black/10">
                <summary className="font-sans text-sm text-tradey-black/80 cursor-pointer mb-4 font-semibold">
                  Tehnički detalji (samo u development modu)
                </summary>
                <div className="space-y-4">
                  <div>
                    <p className="font-sans text-xs text-tradey-black/60 mb-2 uppercase tracking-wide">
                      Error Message:
                    </p>
                    <p className="font-mono text-sm text-tradey-red bg-white p-3 rounded border border-tradey-red/20">
                      {this.state.error.toString()}
                    </p>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <p className="font-sans text-xs text-tradey-black/60 mb-2 uppercase tracking-wide">
                        Component Stack:
                      </p>
                      <pre className="font-mono text-xs text-tradey-black/80 bg-white p-3 rounded border border-tradey-black/10 overflow-auto max-h-60">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="px-8 py-3 bg-tradey-red text-white font-sans text-sm hover:opacity-90 transition-opacity"
              >
                Pokušaj ponovo
              </button>
              <a
                href="/"
                className="px-8 py-3 border border-tradey-black/20 text-tradey-black font-sans text-sm hover:border-tradey-black transition-colors"
              >
                Nazad na početnu
              </a>
            </div>

            {/* Support Contact */}
            <p className="font-sans text-tradey-black/40 text-sm mt-12">
              Ako se problem nastavi, kontaktirajte nas na{' '}
              <a
                href="mailto:support@tradey.com"
                className="text-tradey-red hover:underline"
              >
                support@tradey.com
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
