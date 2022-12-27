import React from 'react';

import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface ErrorData {
  httpCode: number;
  message: string;
}

interface State {
  hasError: boolean;
  errorData?: ErrorData | null;
}

interface CustomError<T> {
  Error: T;
  data: {
    httpStatus: number;
  };
  shape: {
    message: string;
  };
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: CustomError<Error>) {
    // Update state so the next render will show the fallback UI

    return {
      hasError: true,
      errorData: { httpCode: error.data.httpStatus, message: error.shape.message },
    };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can use your own error logging service here
    console.log({ error, errorInfo });
  }

  handleClick = async () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Oops, there is an error!</h2>
          <p>{this.state.errorData?.message}</p>
          <button type="button" onClick={this.handleClick}>
            Try again?
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
