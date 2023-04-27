import React from "react";
import Loader from "components/loader";
import * as Sentry from "@sentry/react";
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
   try{
     Sentry.setUser({
       email: this.props.store.getState().data.user_details.email,
       id: this.props.store.getState().data.business_details.number,
       username: this.props.store.getState().data.business_details.business_name
     });
     Sentry.captureException(error);
   }catch (e) {
   }
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <Loader />;
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
