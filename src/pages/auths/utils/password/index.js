import React, { Component } from "react";
import PasswordInput from "./passwordInput";

class Password extends Component {
  constructor() {
    super();
    this.state = {
      password: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, attr) {
    const newState = { ...this.state };
    newState[attr] = event.target.value;
    this.setState(newState);
  }

  render() {
    return (
      <div className="App">
        <PasswordInput
          value={this.state.password}
          placeholder="Your secure password"
          handleChange={e => this.handleChange(e, "password")}
        />
      </div>
    );
  }
}

export default Password;
