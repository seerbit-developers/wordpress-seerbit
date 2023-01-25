import React from "react";

const Loader = ({type, color}) => {
  return (
    <div id={type === 'login' ? 'login-loader' :"app-loader"} className={type === 'login' ? 'login-loader' :"app-loader"}>
      <div id={type === 'login' ? 'login-spinner' : "spinner"} className={`${type === 'login' ? "login-loader__spinner" : "app-loader__spinner"} ${color ? 'black-loader' : ''}`}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loader;
