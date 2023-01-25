import React from "react";
import Loader from "components/loader";
import * as Sentry from "@sentry/react";
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.log(error)
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // console.log(error, errorInfo);
    // console.log(this.props.store.getState().user_details.email);
    // console.log(this.props.store.getState().business_details.number);
    // console.log(this.props.store.getState().business_details.business_name);
   try{
     Sentry.setUser({
       email: this.props.store.getState().data.user_details.email,
       id: this.props.store.getState().data.business_details.number,
       username: this.props.store.getState().data.business_details.business_name
     });
     Sentry.captureException(error);
   }catch (e) {
     console.log(e)
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
