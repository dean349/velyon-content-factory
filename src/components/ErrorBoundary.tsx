import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  label?: string;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
  resetKeys?: unknown[];
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    const { resetKeys } = this.props;
    if (!this.state.error || !resetKeys) return;
    const prevKeys = prevProps.resetKeys ?? [];
    const changed =
      resetKeys.length !== prevKeys.length ||
      resetKeys.some((key, i) => !Object.is(key, prevKeys[i]));
    if (changed) this.reset();
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(
      `[ErrorBoundary${this.props.label ? `: ${this.props.label}` : ''}]`,
      error,
      info.componentStack,
    );
    this.props.onError?.(error, info);
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    const { children, fallback, label } = this.props;

    if (error) {
      if (fallback) return fallback(error, this.reset);
      return (
        <div
          role="alert"
          style={{
            padding: '24px',
            margin: '16px',
            borderRadius: '12px',
            background: '#1a1a1a',
            border: '1px solid #b91c1c',
            color: '#f5f5f5',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
            maxWidth: '720px',
          }}
        >
          <h2 style={{ margin: '0 0 8px', color: '#f87171' }}>
            {label ? `${label} crashed` : 'Something went wrong'}
          </h2>
          <p style={{ margin: '0 0 12px', color: '#d4d4d4' }}>
            The app caught a render error and prevented a full crash.
          </p>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontSize: '12px',
              background: '#0d0d0d',
              padding: '12px',
              borderRadius: '8px',
              maxHeight: '240px',
              overflow: 'auto',
              margin: '0 0 12px',
            }}
          >
            {error.message}
            {error.stack ? `\n\n${error.stack}` : ''}
          </pre>
          <button
            type="button"
            onClick={this.reset}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #3f3f46',
              background: '#27272a',
              color: '#fafafa',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
