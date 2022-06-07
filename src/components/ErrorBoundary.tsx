import React from 'react'

import Apology from './Apology'

class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    // Log the error to an error reporting service
    this.logErrorToMyService(error, errorInfo)
  }

  logErrorToMyService = (error: any, errorInfo: any) => {
    console.error(error, errorInfo)
  }

  render() {
    const { hasError } = this.state
    const { children } = this.props

    if (hasError) return <Apology /> // Render any custom fallback UI

    return children
  }
}

export default ErrorBoundary
