import React, { Component, ErrorInfo, ReactNode } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log additional details if the error seems related to React rendering
    if (error.message.includes('invariant') || error.message.includes('object with keys')) {
      console.error('This appears to be a React rendering error. Check for objects being rendered as React children.');
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-900">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Something went wrong</h3>
                    <p className="text-sm">
                      We encountered an error while rendering this page. This might be due to invalid data format.
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={this.handleReset} 
                      variant="outline" 
                      size="sm"
                      className="text-red-700 border-red-300 hover:bg-red-100"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                    <Button 
                      onClick={this.handleReload} 
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Reload Page
                    </Button>
                  </div>

                  {process.env.NODE_ENV === 'development' && this.state.error && (
                    <details className="mt-4">
                      <summary className="text-xs cursor-pointer text-red-700 hover:text-red-900">
                        Error Details (Development Only)
                      </summary>
                      <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto max-h-32">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
