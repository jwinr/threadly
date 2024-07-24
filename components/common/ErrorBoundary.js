import React, { Component } from "react"
import styled from "styled-components"

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

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by error boundary:", error, errorInfo)
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
