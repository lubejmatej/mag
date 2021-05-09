import * as React from 'react';
import { ErrorInfo } from 'react';

export class ErrorBoundary extends React.Component<
  {},
  { hasError: false; error: Error | null }
> {
  constructor(props: { hasError: false }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error);
    console.error(errorInfo);
  }

  render() {
    const { error, hasError } = this.state;

    if (hasError) {
      return <h1>Something went wrong: {JSON.stringify(error)}</h1>;
    }

    return this.props.children;
  }
}
