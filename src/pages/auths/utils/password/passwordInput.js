import React from "react";
import "./style.css";
import { strengthIndicator, strengthColor } from "./strength";

export default function PasswordInput(props) {
  const strength = strengthIndicator(props.value);
  const str = strengthColor(strength);
  return (
    <div className="form-field">
      <input
        type="password"
        value={props.value}
        className={props.className}
        placeholder={props.placeholder}
        onChange={props.onChange}
        style={{
          borderBottom: `2px solid ${str.color}`
        }}
      />
      <span
        className="password-strength-label"
        style={{
          color: `${str.color}`
        }}
      >
        {/* {str.label} */}
      </span>
    </div>
  );
}
