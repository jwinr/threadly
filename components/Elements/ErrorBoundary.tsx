import React, { Component, ErrorInfo, ReactNode } from 'react'
import styled from 'styled-components'

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  height: 100%;
  margin: 0 auto;
  justify-content: center;
  text-align: center;

  @media (max-width: 768px) {
    width: auto;
    padding: 50px;
  }
`

const ErrorMessage = styled.h1`
  font-size: 42px;
  font-weight: 800;
`

interface ErrorBoundaryProps {
  children: ReactNode
  errorInfo?: string
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by error boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError || this.props.errorInfo) {
      return (
        <ErrorWrapper>
          <ErrorMessage>Oops! Something went wrong.</ErrorMessage>
          {this.props.errorInfo ? (
            <ErrorMessage>{this.props.errorInfo}</ErrorMessage>
          ) : (
            <ErrorMessage>Please try again.</ErrorMessage>
          )}
        </ErrorWrapper>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
