import React, {Component, ErrorInfo} from "react";

/**
 * Error boundary state
 */
interface IErrorBoundaryState {
    hasError: boolean,
}

/**
 * Error boundary
 */
class ErrorBoundary extends Component<{}, IErrorBoundaryState> {
    private error: Error | undefined = undefined;
    private errorInfo: ErrorInfo | undefined = undefined;

    /**
     * Constructor
     * @param props
     */
    constructor(props: {}) {
        super(props);
        this.state = {hasError: false};
    }

    /**
     * Component has an error
     * @param error
     * @param errorInfo
     */
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.error = error;
        this.errorInfo = errorInfo;
        this.setState({hasError: true});
    }

    /**
     * Render component
     */
    render() {
        return this.state.hasError ? undefined : this.props.children;
    }
}

export default ErrorBoundary;