import { Component } from "react";
import EmptyState from "./EmptyState";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Keep it simple: log for devs, show friendly UI for users.
    // eslint-disable-next-line no-console
    console.error("UI crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page-wrapper container fade-in-up">
          <EmptyState
            icon="⚠️"
            title="Something went wrong"
            description="This page had an unexpected error. Please refresh and try again."
            actionLabel="Refresh"
            actionOnClick={() => window.location.reload()}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

