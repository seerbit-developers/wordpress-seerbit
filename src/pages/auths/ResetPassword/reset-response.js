import React from "react";
import { Link } from "react-router-dom";
import "../../../assets/styles/custom.css";
import logo from "../../../../assets/images/logo.png";
import success from "../../../../assets/images/check.png";

const ResetResponse = ({ data }) => {
  return (
    <div>
      <div className="signin-wrapper">
        <div className="signin-box">
          <h2 className="seerbit-logo">
            <a href="https://seerbit.com" className="">
              <div className="pt-4 pb-2">
                <img src={logo} className="seerbit logo" alt="Seerbit" />
              </div>
            </a>
          </h2>
          <h5 className="signin-title-secondary">{data.head}</h5>
          <div style={{ textAlign: "center", marginBottom: "2em" }}>
            <img
              src={success}
              alt=""
              style={{ width: "75px", height: "auto" }}
            />
          </div>
          <div
            className="text-center pb-4"
            dangerouslySetInnerHTML={createMarkup(data.body)}
          />
          <div className="text-center  font-14">
            <Link to="/auth/login">Return to seerBit Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
  function createMarkup(data) {
    return { __html: data };
  }
};

export default ResetResponse;
