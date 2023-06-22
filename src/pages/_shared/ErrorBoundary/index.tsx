import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

type GlobalErrorBoundaryProps = {
  children: React.ReactNode;
};

const GlobalErrorBoundary = ({ children }: GlobalErrorBoundaryProps) => {
  const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
    return (
      <div>
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary}>Try again</button>
      </div>
    );
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
  );
};

export default GlobalErrorBoundary;
